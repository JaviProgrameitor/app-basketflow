const db = require('../database');
const { v4: uuidv4 } = require('uuid');

// Utilidad para timestamp ISO
function nowTs() {
  return new Date().toISOString();
}

// Consulta de tabla de posiciones (optimizada para tu esquema actual)
// Devuelve el Top N (por defecto 4) para un folder_id (torneo)
function getTopSeeds(folderId, limit = 4) {
  const stmt = db.prepare(`
    SELECT
      t.id AS team_id,
      t.name AS team_name,
      ft.custom_name AS team_custom_name,
      COALESCE(stats.games_played, 0) AS games_played,
      COALESCE(stats.wins, 0) AS wins,
      COALESCE(stats.losses, 0) AS losses,
      COALESCE(stats.points_scored, 0) AS points_scored,
      COALESCE(stats.points_against, 0) AS points_against,
      COALESCE(stats.point_difference, 0) AS point_difference
    FROM teams t
    JOIN folders_teams ft
      ON ft.team_id = t.id
      AND ft.folder_id = ?
      AND ft.deleted = 0
    LEFT JOIN (
      SELECT
        team_id,
        COUNT(*) AS games_played,
        SUM(win) AS wins,
        SUM(loss) AS losses,
        SUM(points_scored) AS points_scored,
        SUM(points_against) AS points_against,
        SUM(points_scored - points_against) AS point_difference
      FROM (
        -- Local
        SELECT
          m.home_team_id AS team_id,
          CASE WHEN m.home_score > m.away_score THEN 1 ELSE 0 END AS win,
          CASE WHEN m.home_score < m.away_score THEN 1 ELSE 0 END AS loss,
          m.home_score AS points_scored,
          m.away_score AS points_against
        FROM matches m
        WHERE m.folder_id = ?
          AND m.match_type = 'league'
          AND m.status = 'completed'
          AND m.deleted = 0
        UNION ALL
        -- Visitante
        SELECT
          m.away_team_id AS team_id,
          CASE WHEN m.away_score > m.home_score THEN 1 ELSE 0 END AS win,
          CASE WHEN m.away_score < m.home_score THEN 1 ELSE 0 END AS loss,
          m.away_score AS points_scored,
          m.home_score AS points_against
        FROM matches m
        WHERE m.folder_id = ?
          AND m.match_type = 'league'
          AND m.status = 'completed'
          AND m.deleted = 0
      )
      GROUP BY team_id
    ) stats ON stats.team_id = t.id
    WHERE t.deleted = 0
    ORDER BY wins DESC, point_difference DESC, points_scored DESC
    LIMIT ?
  `);
  return stmt.all(folderId, folderId, folderId, limit);
}

// Obtiene series de playoffs por torneo (incluye nombres con fallback cuando custom_name = '' o espacios)
function getSeriesByFolder(folderId) {
  const stmt = db.prepare(`
    SELECT
      s.*,
      COALESCE(
        NULLIF(TRIM(fth.custom_name), ''),
        th.name,
        printf('#%d', s.home_team_id)
      ) AS home_team_name,
      COALESCE(
        NULLIF(TRIM(fta.custom_name), ''),
        ta.name,
        printf('#%d', s.away_team_id)
      ) AS away_team_name
    FROM playoff_series s
    LEFT JOIN teams th
      ON th.id = s.home_team_id AND th.deleted = 0
    LEFT JOIN teams ta
      ON ta.id = s.away_team_id AND ta.deleted = 0
    LEFT JOIN folders_teams fth
      ON fth.folder_id = s.folder_id AND fth.team_id = s.home_team_id AND fth.deleted = 0
    LEFT JOIN folders_teams fta
      ON fta.folder_id = s.folder_id AND fta.team_id = s.away_team_id AND fta.deleted = 0
    WHERE s.folder_id = ? AND s.deleted = 0
    ORDER BY s.round ASC, s.bracket ASC, s.id ASC
  `);
  return stmt.all(folderId);
}

// Crea semifinales (round = 1) con Top 4: 1vs4 => 'A', 2vs3 => 'B'. No duplica si ya existen.
function ensureSemifinals(folderId) {
  const existing = db
    .prepare(`SELECT COUNT(*) AS c FROM playoff_series WHERE folder_id = ? AND round = 1 AND deleted = 0`)
    .get(folderId);
  if (existing.c >= 2) {
    return getSeriesByFolder(folderId);
  }

  const seeds = getTopSeeds(folderId, 4);
  if (seeds.length < 4) {
    return { ok: false, message: 'No hay suficientes equipos para generar semifinales.' };
  }

  const seed1 = seeds[0].team_id;
  const seed2 = seeds[1].team_id;
  const seed3 = seeds[2].team_id;
  const seed4 = seeds[3].team_id;

  const insertSeries = db.prepare(`
    INSERT INTO playoff_series (
      id, folder_id, round, bracket, home_team_id, away_team_id,
      best_of, wins_home, wins_away, winner_team_id, status,
      pending_sync, updated_at, deleted
    ) VALUES (?, ?, 1, ?, ?, ?, 3, 0, 0, NULL, 'scheduled', 0, ?, 0)
  `);

  const ts = nowTs();
  const tx = db.transaction(() => {
    insertSeries.run(uuidv4(), folderId, 'A', seed1, seed4, ts);
    insertSeries.run(uuidv4(), folderId, 'B', seed2, seed3, ts);
  });
  tx();

  return getSeriesByFolder(folderId);
}

// Obtiene los partidos de una serie
function getMatchesBySeries(seriesId) {
  const stmt = db.prepare(`
    SELECT m.*
    FROM matches m
    WHERE m.series_id = ? AND m.deleted = 0 AND m.match_type = 'playoff'
    ORDER BY m.game_in_series ASC
  `);
  return stmt.all(seriesId);
}

// Crea un partido para una serie (game_in_series siguiente o especificado)
function createMatchForSeries(seriesId, options) {
  const series = db.prepare(`SELECT * FROM playoff_series WHERE id = ? AND deleted = 0`).get(seriesId);
  if (!series) throw new Error('Serie no encontrada');

  const nextNumber =
    options?.game_in_series ||
    ((db.prepare(`SELECT COALESCE(MAX(game_in_series), 0) AS mx FROM matches WHERE series_id = ? AND deleted = 0`).get(seriesId).mx || 0) + 1);

  // Validar límite best-of
  if (nextNumber > series.best_of) {
    throw new Error(`No se pueden crear más partidos. Límite best-of-${series.best_of}.`);
  }

  const ts = nowTs();
  const insertMatch = db.prepare(`
    INSERT INTO matches (
      id, home_team_id, away_team_id, folder_id,
      number_game, date, time_start, time_end, location,
      referee_main, referee1, referee2, anotator, assistant_anotator, timekeeper, clock_operator,
      status, period, pending_sync, updated_at, deleted, password_crew_chief, last_four_minutes,
      created_at,
      match_type, round, series_id, game_in_series, home_score, away_score, winner_team_id
    ) VALUES (
      ?, ?, ?, ?, NULL, ?, ?, NULL, ?,
      NULL, NULL, NULL, NULL, NULL, NULL, NULL,
      'scheduled', 1, 0, ?, 0, '', 0,
      CURRENT_TIMESTAMP,
      'playoff', ?, ?, ?, 0, 0, NULL
    )
  `);

  insertMatch.run(
    uuidv4(),
    series.home_team_id,
    series.away_team_id,
    series.folder_id,
    options.date || null,
    options.time_start || null,
    options.location || '',
    ts,
    series.round,
    seriesId,
    nextNumber
  );

  return getMatchesBySeries(seriesId);
}

// Recalcula wins/status de una serie desde los partidos completados
function updateSeriesFromMatches(seriesId) {
  const series = db.prepare(`SELECT * FROM playoff_series WHERE id = ? AND deleted = 0`).get(seriesId);
  if (!series) throw new Error('Serie no encontrada');

  const completed = db.prepare(`
    SELECT home_score, away_score
    FROM matches
    WHERE series_id = ? AND deleted = 0 AND status = 'completed'
  `).all(seriesId);

  let winsHome = 0;
  let winsAway = 0;
  for (const m of completed) {
    if (m.home_score > m.away_score) winsHome += 1;
    else if (m.away_score > m.home_score) winsAway += 1;
  }

  const needToWin = Math.floor(series.best_of / 2) + 1;
  const winnerTeamId =
    winsHome >= needToWin ? series.home_team_id :
    winsAway >= needToWin ? series.away_team_id :
    null;

  const status =
    winnerTeamId ? 'completed' :
    completed.length > 0 ? 'in_progress' : 'scheduled';

  const ts = nowTs();
  db.prepare(`
    UPDATE playoff_series
    SET wins_home = ?, wins_away = ?, winner_team_id = ?, status = ?, updated_at = ?
    WHERE id = ?
  `).run(winsHome, winsAway, winnerTeamId, status, ts, seriesId);

  return db.prepare(`SELECT * FROM playoff_series WHERE id = ?`).get(seriesId);
}

// Helpers internos
function getSemifinalWinners(folderId) {
  const rows = db.prepare(`
    SELECT bracket, winner_team_id
    FROM playoff_series
    WHERE folder_id = ?
      AND round = 1
      AND deleted = 0
      AND status = 'completed'
      AND winner_team_id IS NOT NULL
    ORDER BY bracket ASC
  `).all(folderId);

  // Normaliza por llave
  const map = {};
  for (const r of rows) {
    if (r.bracket) map[r.bracket] = r.winner_team_id;
  }
  return map;
}

function finalExists(folderId) {
  const r = db.prepare(`
    SELECT COUNT(*) AS c
    FROM playoff_series
    WHERE folder_id = ? AND round = 2 AND deleted = 0
  `).get(folderId);
  return r.c > 0;
}

// Genera la Final (round = 2) si A y B están definidos.
// Home/away: por ranking (Top 4); si falta ranking, 'A' es local.
function ensureFinal(folderId) {
  if (finalExists(folderId)) {
    return getSeriesByFolder(folderId);
  }

  const winners = getSemifinalWinners(folderId);
  const winnerA = winners['A'];
  const winnerB = winners['B'];
  if (!winnerA || !winnerB) {
    return { ok: false, message: 'Aún no hay ganadores de ambas semifinales.' };
  }

  // Determinar local por ranking de liga (Top 4)
  const seeds = getTopSeeds(folderId, 4);
  const rankMap = {};
  seeds.forEach((s, idx) => { rankMap[s.team_id] = idx + 1; }); // 1 = mejor rank

  const rankA = rankMap[winnerA] || Number.POSITIVE_INFINITY;
  const rankB = rankMap[winnerB] || Number.POSITIVE_INFINITY;

  let home = winnerA;
  let away = winnerB;
  if (rankB < rankA) {
    home = winnerB;
    away = winnerA;
  }

  const ts = nowTs();
  db.prepare(`
    INSERT INTO playoff_series (
      id, folder_id, round, bracket, home_team_id, away_team_id,
      best_of, wins_home, wins_away, winner_team_id, status,
      pending_sync, updated_at, deleted
    ) VALUES (?, ?, 2, 'Final', ?, ?, 3, 0, 0, NULL, 'scheduled', 0, ?, 0)
  `).run(uuidv4(), folderId, home, away, ts);

  return getSeriesByFolder(folderId);
}

module.exports = {
  getTopSeeds,
  getSeriesByFolder,
  ensureSemifinals,
  getMatchesBySeries,
  createMatchForSeries,
  updateSeriesFromMatches,
  ensureFinal
};