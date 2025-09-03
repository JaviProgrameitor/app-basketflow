const { ipcMain } = require('electron');
const axios = require('axios');
const db = require('../database.js');
const { getLastSyncAt, setLastSyncAt } = require('../db/syncState.js')

const API_BASE_URL = process.env.API_BASE_URL || 'https://backend-basketflow-production.up.railway.app/api'; // Ajusta tu URL

function getCurrentUserId() {
  const row = db.prepare(`SELECT user_id FROM session LIMIT 1`).get();
  return row?.user_id || null;
}

// function getLastSyncAt(userId) {
//   const row = db.prepare(`SELECT last_sync_at FROM sync_state WHERE user_id = ?`).get(userId);
//   return row?.last_sync_at || '1970-01-01T00:00:00.000Z';
// }

// function setLastSyncAt(userId, isoString) {
//   const up = db.prepare(`
//     INSERT INTO sync_state (user_id, last_sync_at)
//     VALUES (?, ?)
//     ON CONFLICT(user_id) DO UPDATE SET last_sync_at = excluded.last_sync_at
//   `);
//   up.run(userId, isoString);
// }

const tables = [
  { name: 'folders',           pk: ['id'] },
  { name: 'teams',             pk: ['id'] },
  { name: 'folders_teams',     pk: ['folder_id','team_id'] },
  { name: 'matches',           pk: ['id'] },
  { name: 'playoff_series',    pk: ['id'] },
  { name: 'players',           pk: ['id'] },
  { name: 'match_players',     pk: ['match_id','player_id'] },
  { name: 'match_events',      pk: ['id'] },
  { name: 'generated_matches', pk: ['id'] },
];

function collectLocalChanges() {
  const changes = {};
  for (const t of tables) {
    const rows = db.prepare(`SELECT * FROM ${t.name} WHERE pending_sync = 1`).all();
    changes[t.name] = rows;
  }
  return changes;
}

function clearPendingSyncForPushed(changes) {
  for (const t of tables) {
    const rows = changes[t.name] || [];
    if (!rows.length) continue;

    if (t.pk.length === 1) {
      const pk = t.pk[0];
      const placeholders = rows.map(() => '?').join(',');
      const ids = rows.map(r => r[pk]);
      const stmt = db.prepare(`UPDATE ${t.name} SET pending_sync = 0 WHERE ${pk} IN (${placeholders})`);
      stmt.run(...ids);
    } else {
      // Composite PK: hacer por fila
      const setStmt = db.prepare(`UPDATE ${t.name} SET pending_sync = 0 WHERE ${t.pk[0]} = ? AND ${t.pk[1]} = ?`);
      const trx = db.transaction((rows) => {
        for (const r of rows) {
          setStmt.run(r[t.pk[0]], r[t.pk[1]]);
        }
      });
      trx(rows);
    }
  }
}

function upsertLocalRecord(table, pkFields, rec) {
  // Detectar existencia
  let whereClause = pkFields.map(k => `${k} = ?`).join(' AND ');
  const whereValues = pkFields.map(k => rec[k]);

  const existing = db.prepare(`SELECT updated_at, pending_sync FROM ${table} WHERE ${whereClause} LIMIT 1`).get(...whereValues);

  // Conflicto por updated_at, se aplica last-write-wins (ISO string comparables lexicográficamente)
  const shouldApply = !existing || (rec.updated_at && existing.updated_at && rec.updated_at > existing.updated_at) || existing.pending_sync === 0;

  if (!shouldApply) return false;

  // Intentar UPDATE primero
  const keys = Object.keys(rec);
  const setClause = keys.map(k => `${k} = @${k}`).join(', ');
  const updateStmt = db.prepare(`UPDATE ${table} SET ${setClause} WHERE ${whereClause}`);
  const resUpd = updateStmt.run({ ...rec }, ...whereValues);

  if (resUpd.changes === 0) {
    // No existía: INSERT
    const cols = keys.join(', ');
    const placeholders = keys.map(k => `@${k}`).join(', ');
    const insertStmt = db.prepare(`INSERT INTO ${table} (${cols}) VALUES (${placeholders})`);
    insertStmt.run({ ...rec });
  }
  return true;
}

function applyServerChanges(serverChanges) {
  const trx = db.transaction((serverChanges) => {
    for (const t of tables) {
      const list = serverChanges[t.name] || [];
      for (const rec of list) {
        // En local NO tenemos user_id, lo ignoramos si viene
        const { user_id, ...localRec } = rec;
        // Asegurar pending_sync=0 para datos del servidor
        localRec.pending_sync = 0;
        upsertLocalRecord(t.name, t.pk, localRec);
      }
    }
  });
  trx(serverChanges);
}

function applyServerSnapshot(serverData) {
  const trx = db.transaction((serverData) => {
    for (const t of tables) {
      const list = serverData[t.name] || [];
      for (const rec of list) {
        let { user_id, createdAt, updatedAt, ...localRec } = rec;
        localRec.updated_at = new Date(updatedAt).toISOString();
        localRec.created_at = createdAt;
        localRec.pending_sync = 0;
        upsertLocalRecord(t.name, t.pk, localRec);
      }
    }
  });
  trx(serverData);
}

// Opcional: limpiar datos locales antes del bootstrap para evitar “mezclas” de usuarios.
// Preserva tablas: session, device, licenses, sync_state.
function resetLocalDomainData() {
  const domainTables = [
    'folders_teams','match_players','match_events',
    'generated_matches','players','matches','playoff_series',
    'teams','folders'
  ];
  const trx = db.transaction(() => {
    for (const t of domainTables) {
      db.prepare(`DELETE FROM ${t}`).run();
    }
    // IMPORTANTE: no limpiamos session/device/licenses/sync_state
  });
  trx();
}

ipcMain.handle('getLastSyncAt', async () => {
  const userId = getCurrentUserId();
  return await getLastSyncAt(userId);
})

ipcMain.handle('syncData', async () => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error('No hay usuario en sesión para sincronizar');
  }

  const since = getLastSyncAt(userId);
  const localChanges = collectLocalChanges();

  // Llamada al servidor
  const url = `${API_BASE_URL}/sync/push-pull`;
  const payload = {
    user_id: userId,
    since,
    changes: localChanges,
  };

  let response;
  try {
    response = await axios.post(url, payload, { timeout: 60000 });
  } catch (err) {
    throw new Error(err?.response?.data?.message || err?.message || 'Fallo al contactar el servidor');
  }

  const data = response.data || {};
  const { serverTime, changes: serverChanges } = data;

  // Aplicar cambios del servidor localmente
  applyServerChanges(serverChanges || {});

  // Marcar como sincronizados los cambios enviados
  clearPendingSyncForPushed(localChanges);

  // Actualizar last_sync_at
  const newSyncAt = serverTime || new Date().toISOString();
  setLastSyncAt(userId, newSyncAt);

  const pushedTotal = Object.values(localChanges).reduce((acc, arr) => acc + (arr?.length || 0), 0);
  const pulledTotal = Object.values(serverChanges || {}).reduce((acc, arr) => acc + (arr?.length || 0), 0);

  return { pushedTotal, pulledTotal, lastSyncAt: newSyncAt };
});

ipcMain.handle('bootstrapSync', async () => {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error('No hay usuario en sesión para sincronizar');
  }

  // 1) Solicitar snapshot completo al servidor
  let response;
  try {
    response = await axios.post(`${API_BASE_URL}/sync/export-all`, { user_id: userId }, { timeout: 120000 });
  } catch (err) {
    throw new Error(err?.response?.data?.message || err?.message || 'No se pudo obtener datos del servidor');
  }

  const { serverTime, data } = response.data || {};
  if (!data) throw new Error('Respuesta del servidor inválida');

  // 2) Limpiar datos locales (opcional pero recomendado para bootstrap)
  resetLocalDomainData();

  // 3) Aplicar snapshot en BD local
  applyServerSnapshot(data);

  // 4) Marcar última sync
  const newSyncAt = serverTime || new Date().toISOString();
  setLastSyncAt(userId, newSyncAt);

  const pulledTotal = Object.values(data).reduce((acc, arr) => acc + (arr?.length || 0), 0);

  return { pulledTotal, lastSyncAt: newSyncAt };
});