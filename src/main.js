require('./ipc-handlers/folders.js')
require('./ipc-handlers/teams.js');
require('./ipc-handlers/foldersTeams.js');
require('./ipc-handlers/match.js');
require('./ipc-handlers/players.js');
require('./ipc-handlers/matchPlayers.js');
require('./ipc-handlers/matchEvents.js');
require('./ipc-handlers/generatedMatches.js');
require('./ipc-handlers/stats.js');
require('./ipc-handlers/auth.js');
require('./ipc-handlers/license.js');
require('./ipc-handlers/device.js');
require('./ipc-handlers/payment.js');
require('./ipc-handlers/playoffs.js');
require('./ipc-handlers/user.js');
require('./ipc-handlers/sync.js');
require('./ipc-handlers/session.js');
require('./ipc-handlers/password.js');

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
// const puppeteer = require('puppeteer-core');
const puppeteer = require('puppeteer'); // Ahora usa puppeteer
const fs = require('fs');
const path = require('path');
const os = require('os');
const db = require('./database.js');
const bcrypt = require('bcryptjs');
const { templateGameReport } = require('./data/match.js');

const imagePath = path.join(app.getAppPath(), 'assets', 'logo_fiba.png');
const imageData = fs.readFileSync(imagePath).toString('base64');
const imageSrc = `data:image/png;base64,${imageData}`;

// --- Función para encontrar ejecutable de navegador ---
function getCandidates() {
  const platform = os.platform();
  if (platform === 'win32') {
    return [
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files\\Chromium\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Chromium\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    ];
  } else if (platform === 'darwin') {
    return [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
      '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    ];
  } else {
    return [
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/snap/bin/chromium',
      '/usr/bin/microsoft-edge',
      '/usr/bin/microsoft-edge-stable',
    ];
  }
}

function findChromeExecutable() {
  const candidates = getCandidates();
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

ipcMain.handle('generateDeviceId', (event) => {
  const username = os.userInfo().username || "";
  const hostname = os.hostname() || "";
  const platform = os.platform() || "";

  const deviceId = `${username}-${hostname}-${platform}`;
  const deviceIdHash = bcrypt.hashSync(deviceId, 10);
  return deviceIdHash;
});

// Handle encryption and decryption of passwords
ipcMain.handle('hashPassword', async (event, password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
});

ipcMain.handle('comparePassword', async (event, password, hash) => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
});

// --- IPC Handler para generar PDF ---
ipcMain.handle('generateOfficialGameReport', async (event, matchData, imageSrc) => {
  // HTML dinámico con los datos recibidos
  const html = templateGameReport(matchData, "https://firebasestorage.googleapis.com/v0/b/control-asistencias-dfa14.appspot.com/o/archivos-extras%2Flogo_fiba.png?alt=media&token=8902f832-22b1-4fad-b063-2706a65e2499");

  // Lanza Chromium usando puppeteer (no requiere executablePath)
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const { filePath } = await dialog.showSaveDialog({
    title: 'Guardar planilla PDF',
    defaultPath: 'planilla_basquet.pdf',
    filters: [{ name: 'PDF', extensions: ['pdf'] }]
  });

  if (filePath) {
    await page.pdf({ path: filePath, format: 'Legal', printBackground: true });
  }
  await browser.close();

  return filePath ? 'PDF creado correctamente' : 'Cancelado por el usuario';
});

ipcMain.handle('getStatsMatchForReportByMatchId', (event, matchId) => {
  try {
    const stmt = db.prepare(`
      SELECT
        m.*,
        f.name_tournament,
        COALESCE(NULLIF(TRIM(home_ft.custom_name), ''), home_team.name) AS home_team_name,
        home_ft.coach AS home_team_coach,
        home_ft.assistant_coach AS home_team_assistant_coach,
        home_ft.primary_color AS home_team_color,
        COALESCE(NULLIF(TRIM(away_ft.custom_name), ''), away_team.name) AS away_team_name,
        away_ft.coach AS away_team_coach,
        away_ft.assistant_coach AS away_team_assistant_coach,
        away_ft.primary_color AS away_team_color,
        m.home_score AS home_team_final_points,
        m.away_score AS away_team_final_points,
        CASE
          WHEN m.winner_team_id = m.home_team_id THEN COALESCE(NULLIF(TRIM(home_ft.custom_name), ''), home_team.name)
          WHEN m.winner_team_id = m.away_team_id THEN COALESCE(NULLIF(TRIM(away_ft.custom_name), ''), away_team.name)
          ELSE 'Empate'
        END AS winner_team_name,
        COALESCE(home_p1.points, 0) AS home_p1_points,
        COALESCE(home_p2.points, 0) AS home_p2_points,
        COALESCE(home_p3.points, 0) AS home_p3_points,
        COALESCE(home_p4.points, 0) AS home_p4_points,
        COALESCE(home_p5.points, 0) AS home_p5_points,
        COALESCE(away_p1.points, 0) AS away_p1_points,
        COALESCE(away_p2.points, 0) AS away_p2_points,
        COALESCE(away_p3.points, 0) AS away_p3_points,
        COALESCE(away_p4.points, 0) AS away_p4_points,
        COALESCE(away_p5.points, 0) AS away_p5_points
      FROM matches m
      LEFT JOIN folders f ON f.id = m.folder_id
      LEFT JOIN teams home_team ON home_team.id = m.home_team_id
      LEFT JOIN folders_teams home_ft ON home_ft.team_id = m.home_team_id AND home_ft.folder_id = m.folder_id
      LEFT JOIN teams away_team ON away_team.id = m.away_team_id
      LEFT JOIN folders_teams away_ft ON away_ft.team_id = m.away_team_id AND away_ft.folder_id = m.folder_id

      -- Puntos por periodo local
      LEFT JOIN (
        SELECT match_id, team_id, period, SUM(point_value) AS points
        FROM match_events
        WHERE event_type = 'point'
        GROUP BY match_id, team_id, period
      ) home_p1 ON home_p1.match_id = m.id AND home_p1.team_id = m.home_team_id AND home_p1.period = 1

      LEFT JOIN (
        SELECT match_id, team_id, period, SUM(point_value) AS points
        FROM match_events
        WHERE event_type = 'point'
        GROUP BY match_id, team_id, period
      ) home_p2 ON home_p2.match_id = m.id AND home_p2.team_id = m.home_team_id AND home_p2.period = 2

      LEFT JOIN (
        SELECT match_id, team_id, period, SUM(point_value) AS points
        FROM match_events
        WHERE event_type = 'point'
        GROUP BY match_id, team_id, period
      ) home_p3 ON home_p3.match_id = m.id AND home_p3.team_id = m.home_team_id AND home_p3.period = 3

      LEFT JOIN (
        SELECT match_id, team_id, period, SUM(point_value) AS points
        FROM match_events
        WHERE event_type = 'point'
        GROUP BY match_id, team_id, period
      ) home_p4 ON home_p4.match_id = m.id AND home_p4.team_id = m.home_team_id AND home_p4.period = 4

      LEFT JOIN (
        SELECT match_id, team_id, period, SUM(point_value) AS points
        FROM match_events
        WHERE event_type = 'point'
        GROUP BY match_id, team_id, period
      ) home_p5 ON home_p5.match_id = m.id AND home_p5.team_id = m.home_team_id AND home_p5.period = 5

      -- Puntos por periodo visitante
      LEFT JOIN (
        SELECT match_id, team_id, period, SUM(point_value) AS points
        FROM match_events
        WHERE event_type = 'point'
        GROUP BY match_id, team_id, period
      ) away_p1 ON away_p1.match_id = m.id AND away_p1.team_id = m.away_team_id AND away_p1.period = 1

      LEFT JOIN (
        SELECT match_id, team_id, period, SUM(point_value) AS points
        FROM match_events
        WHERE event_type = 'point'
        GROUP BY match_id, team_id, period
      ) away_p2 ON away_p2.match_id = m.id AND away_p2.team_id = m.away_team_id AND away_p2.period = 2

      LEFT JOIN (
        SELECT match_id, team_id, period, SUM(point_value) AS points
        FROM match_events
        WHERE event_type = 'point'
        GROUP BY match_id, team_id, period
      ) away_p3 ON away_p3.match_id = m.id AND away_p3.team_id = m.away_team_id AND away_p3.period = 3

      LEFT JOIN (
        SELECT match_id, team_id, period, SUM(point_value) AS points
        FROM match_events
        WHERE event_type = 'point'
        GROUP BY match_id, team_id, period
      ) away_p4 ON away_p4.match_id = m.id AND away_p4.team_id = m.away_team_id AND away_p4.period = 4

      LEFT JOIN (
        SELECT match_id, team_id, period, SUM(point_value) AS points
        FROM match_events
        WHERE event_type = 'point'
        GROUP BY match_id, team_id, period
      ) away_p5 ON away_p5.match_id = m.id AND away_p5.team_id = m.away_team_id AND away_p5.period = 5

      WHERE m.id = ?;
    `);
    const matchStats = stmt.get(matchId);

    return matchStats;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch match stats for report');
  }
})

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(app.getAppPath(), 'assets', 'logo.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, // <--- Esto está bien
      contextIsolation: true, // <--- Solo aquí!
      enableRemoteModule: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      sandbox: true, // <--- Debe ir dentro de webPreferences
    }
  });

  // and load the index.html of the app.
  mainWindow.maximize();
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' data: blob: http://localhost:8080 http://localhost:3000 https://js.stripe.com;" +
          "script-src 'self' 'unsafe-eval' data: blob: http://localhost:8080 http://localhost:3000 https://js.stripe.com;" +
          "style-src 'self' 'unsafe-inline' data: blob: http://localhost:8080 http://localhost:3000 https://js.stripe.com;" +
          "connect-src 'self' data: blob: http://localhost:8080 http://localhost:3000 https://js.stripe.com ws://localhost:* https://merchant-ui-api.stripe.com https://r.stripe.com https://api.stripe.com;" +
          "frame-src 'self' blob: data: https://js.stripe.com https://hooks.stripe.com https://m.stripe.network;"
        ]
      }
    });
  });

  mainWindow.webContents.openDevTools({ mode: 'detach' });
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.