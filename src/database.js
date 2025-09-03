// database.js
const Database = require('better-sqlite3');
const db = new Database('basketFlow.db');

// Crear tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS folders (
    id TEXT PRIMARY KEY,
    name VARCHAR NOT NULL,
    name_tournament VARCHAR NOT NULL,
    activated_playoffs INTEGER DEFAULT 0,
    pending_sync INTEGER DEFAULT 0,
    updated_at TEXT NOT NULL,
    deleted INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    name VARCHAR NOT NULL,
    pending_sync INTEGER DEFAULT 0,
    updated_at TEXT NOT NULL,
    deleted INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS folders_teams (
    folder_id TEXT NOT NULL,
    team_id TEXT NOT NULL,
    custom_name VARCHAR,
    coach VARCHAR NOT NULL,
    assistant_coach VARCHAR,
    primary_color VARCHAR,
    pending_sync INTEGER DEFAULT 0,
    updated_at TEXT NOT NULL,
    deleted INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (folder_id, team_id),
    FOREIGN KEY (folder_id) REFERENCES folders(id),
    FOREIGN KEY (team_id) REFERENCES teams(id)
  );

  CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    home_team_id TEXT NOT NULL,
    away_team_id TEXT NOT NULL,
    folder_id TEXT NOT NULL,
    number_game INTEGER,
    date DATE NOT NULL,
    time_start TIME NOT NULL,
    time_end TIME,
    location VARCHAR NOT NULL,
    referee_main VARCHAR,
    referee1 VARCHAR,
    referee2 VARCHAR,
    anotator VARCHAR,
    assistant_anotator VARCHAR,
    timekeeper VARCHAR,
    clock_operator VARCHAR,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','playing', 'finalizing','completed')),
    period INTEGER DEFAULT 1,
    pending_sync INTEGER DEFAULT 0,
    updated_at TEXT NOT NULL,
    deleted INTEGER DEFAULT 0,
    password_crew_chief TEXT DEFAULT '',
    last_four_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Nuevos campos
    match_type TEXT NOT NULL DEFAULT 'league' CHECK (match_type IN ('league','playoff','friendly','cup')),
    round INTEGER,
    series_id TEXT,                 -- Serie de playoffs
    game_in_series INTEGER,            -- 1,2,3...
    home_score INTEGER DEFAULT 0,
    away_score INTEGER DEFAULT 0,
    winner_team_id TEXT,

    FOREIGN KEY (home_team_id) REFERENCES teams(id),
    FOREIGN KEY (away_team_id) REFERENCES teams(id),
    FOREIGN KEY (folder_id) REFERENCES folders(id),
    FOREIGN KEY (series_id) REFERENCES playoff_series(id),
    FOREIGN KEY (winner_team_id) REFERENCES teams(id)
  );

  CREATE TABLE IF NOT EXISTS playoff_series (
    id TEXT PRIMARY KEY,
    folder_id TEXT NOT NULL,                     -- Torneo
    round INTEGER NOT NULL,                         -- 1: Cuartos, 2: Semis, 3: Final, etc.
    bracket TEXT,                                   -- Opcional: 'A','B','C' o '1','2' para llaves
    home_team_id TEXT NOT NULL,
    away_team_id TEXT NOT NULL,
    best_of INTEGER NOT NULL DEFAULT 3 CHECK (best_of IN (1,3,5,7)),
    wins_home INTEGER NOT NULL DEFAULT 0,
    wins_away INTEGER NOT NULL DEFAULT 0,
    winner_team_id TEXT,                         -- Se setea al completar la serie
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled','in_progress','completed')),
    pending_sync INTEGER DEFAULT 0,
    updated_at TEXT NOT NULL,
    deleted INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (folder_id) REFERENCES folders(id),
    FOREIGN KEY (home_team_id) REFERENCES teams(id),
    FOREIGN KEY (away_team_id) REFERENCES teams(id),
    FOREIGN KEY (winner_team_id) REFERENCES teams(id)
  );

  CREATE TABLE IF NOT EXISTS players (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL,
    folder_id TEXT NOT NULL,
    number INTEGER NOT NULL,
    name VARCHAR NOT NULL,
    position VARCHAR,
    pending_sync INTEGER DEFAULT 0,
    updated_at TEXT NOT NULL,
    deleted INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (folder_id) REFERENCES folders(id)
  );

  CREATE TABLE IF NOT EXISTS match_players (
    match_id TEXT NOT NULL,
    player_id TEXT NOT NULL,
    jersey_number INTEGER,
    participation TEXT NOT NULL DEFAULT 'did_not_play' CHECK (participation IN ('starter','substitute','did_not_play')),
    pending_sync INTEGER DEFAULT 0,
    updated_at TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted INTEGER DEFAULT 0,
    PRIMARY KEY (match_id, player_id),
    FOREIGN KEY (match_id) REFERENCES matches(id),
    FOREIGN KEY (player_id) REFERENCES players(id)
  );

  CREATE TABLE IF NOT EXISTS match_events (
    id TEXT PRIMARY KEY,
    match_id TEXT NOT NULL,
    player_id TEXT,
    event_type VARCHAR NOT NULL CHECK (event_type IN ('point','foul','substitution','timeout','period_start','period_end','game_start','game_end')),
    point_type VARCHAR,
    point_value INTEGER,
    foul_type VARCHAR,
    team_id TEXT NOT NULL,
    period INTEGER NOT NULL,
    minute INTEGER,
    pending_sync INTEGER DEFAULT 0,
    updated_at TEXT NOT NULL,
    deleted INTEGER DEFAULT 0,
    cause TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (match_id) REFERENCES matches(id),
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (team_id) REFERENCES teams(id)
  );

  CREATE TABLE IF NOT EXISTS generated_matches (
    id TEXT PRIMARY KEY,
    folder_id TEXT NOT NULL,
    home_team_id TEXT NOT NULL,
    away_team_id TEXT NOT NULL,
    date DATE,
    time_start TIME,
    location VARCHAR,
    round INTEGER,
    published INTEGER DEFAULT 0,
    pending_sync INTEGER DEFAULT 0,
    updated_at TEXT NOT NULL,
    deleted INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (folder_id) REFERENCES folders(id),
    FOREIGN KEY (home_team_id) REFERENCES teams(id),
    FOREIGN KEY (away_team_id) REFERENCES teams(id)
  );

  CREATE TABLE IF NOT EXISTS session (
    user_id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
    login_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS device (
    device_id TEXT PRIMARY KEY,
    device_name TEXT,
    registered_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS licenses (
    user_id TEXT NOT NULL,
    device_id TEXT NOT NULL,
    license_token TEXT NOT NULL,
    issued_at TEXT NOT NULL,
    PRIMARY KEY (user_id, device_id),
    FOREIGN KEY (device_id) REFERENCES device(device_id),
    FOREIGN KEY (user_id) REFERENCES session(user_id)
  );

  CREATE TABLE IF NOT EXISTS sync_state (
    user_id TEXT PRIMARY KEY,
    last_sync_at TEXT NOT NULL
  );
`);

// Exportar la base de datos para usarla en otros archivos
module.exports = db;