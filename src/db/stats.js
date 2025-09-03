const db = require('../database.js');

// Stats by Match
const getStatsByMatch = (match_id) => {
  try {
    const stmt = db.prepare(`
      SELECT
        p.id AS player_id,
        p.name AS player_name,
        t.name AS team_name,
        ft.custom_name AS team_custom_name,
        ft.primary_color AS team_color,
        mp.jersey_number,
        p.number AS player_number,
        COALESCE(SUM(CASE WHEN me.event_type = 'point' THEN me.point_value ELSE 0 END), 0) AS points,
        COALESCE(SUM(CASE WHEN me.event_type = 'point' AND me.point_type = 'simple' THEN 1 ELSE 0 END), 0) AS points_simple,
        COALESCE(SUM(CASE WHEN me.event_type = 'point' AND me.point_type = 'double' THEN 1 ELSE 0 END), 0) AS points_double,
        COALESCE(SUM(CASE WHEN me.event_type = 'point' AND me.point_type = 'triple' THEN 1 ELSE 0 END), 0) AS points_triple,
        COALESCE(SUM(CASE WHEN me.event_type = 'foul' THEN 1 ELSE 0 END), 0) AS fouls
      FROM players p
      JOIN match_players mp ON mp.player_id = p.id AND mp.deleted = 0
      JOIN teams t ON p.team_id = t.id AND t.deleted = 0
      JOIN matches m ON mp.match_id = m.id AND m.deleted = 0
      JOIN folders_teams ft ON ft.team_id = t.id AND ft.folder_id = p.folder_id AND ft.deleted = 0
      LEFT JOIN match_events me ON me.player_id = p.id AND me.match_id = mp.match_id AND me.deleted = 0
      WHERE mp.match_id = ?
        AND p.deleted = 0
      GROUP BY p.id
      ORDER BY points DESC, fouls DESC;
    `)
    const stats = stmt.all(match_id);
    return stats;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch player stats');
  }
};

// Stats by folders
const getStatsByFolder = (folder_id) => {
  try {
    const stmt = db.prepare(`
      SELECT
        t.id AS team_id,
        COALESCE(NULLIF(TRIM(ft.custom_name), ''), t.name) AS team_name,
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
          -- Estadísticas como local
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
          -- Estadísticas como visitante
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
      ORDER BY wins DESC, point_difference DESC, points_scored DESC;
    `)
    const stats = stmt.all(folder_id, folder_id, folder_id);
    return stats;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch folder stats');
  }
};

const getPointsPerGameByFolder = (folderId) => {
  try {
    const stmt = db.prepare(`
      SELECT
        p.id AS player_id,
        p.name AS player_name,
        t.name AS team_name,
        ft.custom_name AS team_custom_name,
        ft.primary_color AS team_color,
        SUM(CASE WHEN me.event_type = 'point' THEN me.point_value ELSE 0 END) AS total_points,
        COUNT(DISTINCT mp.match_id) AS games_played,
        ROUND(
          1.0 * SUM(CASE WHEN me.event_type = 'point' THEN me.point_value ELSE 0 END) / 
          COUNT(DISTINCT mp.match_id), 2
        ) AS avg_points_per_game
      FROM players p
      JOIN teams t ON t.id = p.team_id AND t.deleted = 0
      JOIN folders_teams ft ON ft.team_id = t.id AND ft.folder_id = p.folder_id AND ft.deleted = 0
      JOIN match_players mp ON mp.player_id = p.id AND mp.deleted = 0
      JOIN matches m ON m.id = mp.match_id AND m.folder_id = p.folder_id AND m.status = 'completed' AND m.deleted = 0
      LEFT JOIN match_events me ON me.match_id = mp.match_id AND me.player_id = p.id AND me.event_type = 'point' AND me.deleted = 0
      WHERE p.folder_id = ?
        AND p.deleted = 0
      GROUP BY p.id
      HAVING games_played > 0
      ORDER BY avg_points_per_game DESC, total_points DESC
      LIMIT 5;
    `)
    const stats = stmt.all(folderId);
    return stats;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch points per game');
  }
};

const getThreePointersMadeByFolder = (folderId) => {
  try {
    const stmt = db.prepare(`
      SELECT
        p.id AS player_id,
        p.name AS player_name,
        t.name AS team_name,
        ft.custom_name AS team_custom_name,
        COUNT(me.id) AS triples_made
      FROM players p
      JOIN teams t ON t.id = p.team_id AND t.deleted = 0
      JOIN folders_teams ft ON ft.team_id = t.id AND ft.folder_id = p.folder_id AND ft.deleted = 0
      JOIN match_players mp ON mp.player_id = p.id AND mp.deleted = 0
      JOIN matches m ON m.id = mp.match_id AND m.folder_id = p.folder_id AND m.status = 'completed' AND m.deleted = 0
      JOIN match_events me ON me.match_id = mp.match_id AND me.player_id = p.id AND me.deleted = 0
      WHERE 
        p.folder_id = ?
        AND p.deleted = 0
        AND me.event_type = 'point'
        AND me.point_value = 3
      GROUP BY p.id
      ORDER BY triples_made DESC
      LIMIT 5;
    `);
    const stats = stmt.all(folderId);
    return stats;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch three-pointers made');
  }
};

const getTopScorersTeamsByFolder = (folderId) => {
  try {
    const stmt = db.prepare(`
      SELECT
        t.id AS team_id,
        t.name AS team_name,
        ft.custom_name AS team_custom_name,
        SUM(
          CASE 
            WHEN m.home_team_id = t.id THEN home_points
            WHEN m.away_team_id = t.id THEN away_points
            ELSE 0
          END
        ) AS total_points_scored
      FROM teams t
      JOIN folders_teams ft ON ft.team_id = t.id AND ft.folder_id = ? AND ft.deleted = 0
      JOIN (
        SELECT
          m.id,
          m.home_team_id,
          m.away_team_id,
          -- Puntos anotados por el local
          COALESCE(SUM(CASE WHEN me.team_id = m.home_team_id AND me.event_type = 'point' AND me.deleted = 0 THEN me.point_value ELSE 0 END), 0) AS home_points,
          -- Puntos anotados por el visitante
          COALESCE(SUM(CASE WHEN me.team_id = m.away_team_id AND me.event_type = 'point' AND me.deleted = 0 THEN me.point_value ELSE 0 END), 0) AS away_points
        FROM matches m
        LEFT JOIN match_events me ON me.match_id = m.id
        WHERE m.folder_id = ?
          AND m.status = 'completed'
          AND m.deleted = 0
        GROUP BY m.id
      ) m ON m.home_team_id = t.id OR m.away_team_id = t.id
      WHERE t.deleted = 0
      GROUP BY t.id
      ORDER BY total_points_scored DESC
      LIMIT 5;
    `);
    const stats = stmt.all(folderId, folderId);
    return stats;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch top scorers teams by folder');
  }
};

const getFewerPointsAllowedTeamsByFolder = (folderId) => {
  try {
    const stmt = db.prepare(`
      SELECT
        t.id AS team_id,
        t.name AS team_name,
        ft.custom_name AS team_custom_name,
        SUM(
          CASE 
            WHEN m.home_team_id = t.id THEN away_points
            WHEN m.away_team_id = t.id THEN home_points
            ELSE 0
          END
        ) AS total_points_against
      FROM teams t
      JOIN folders_teams ft ON ft.team_id = t.id AND ft.folder_id = ? AND ft.deleted = 0
      JOIN (
        SELECT
          m.id,
          m.home_team_id,
          m.away_team_id,
          COALESCE(SUM(CASE WHEN me.team_id = m.home_team_id AND me.event_type = 'point' AND me.deleted = 0 THEN me.point_value ELSE 0 END), 0) AS home_points,
          COALESCE(SUM(CASE WHEN me.team_id = m.away_team_id AND me.event_type = 'point' AND me.deleted = 0 THEN me.point_value ELSE 0 END), 0) AS away_points
        FROM matches m
        LEFT JOIN match_events me ON me.match_id = m.id
        WHERE m.folder_id = ?
          AND m.status = 'completed'
          AND m.deleted = 0
        GROUP BY m.id
      ) m ON m.home_team_id = t.id OR m.away_team_id = t.id
      WHERE t.deleted = 0
      GROUP BY t.id
      ORDER BY total_points_against ASC
      LIMIT 5;
    `);
    const stats = stmt.all(folderId, folderId);
    return stats;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch fewer points allowed teams by folder');
  }
};

const getFewerFoulsMadeTeamsByFolder = (folderId) => {
  try {
    const stmt = db.prepare(`
      SELECT
        t.id AS team_id,
        t.name AS team_name,
        ft.custom_name AS team_custom_name,
        COALESCE(SUM(fouls.foul_count), 0) AS total_fouls
      FROM teams t
      JOIN folders_teams ft ON ft.team_id = t.id AND ft.folder_id = ? AND ft.deleted = 0
      LEFT JOIN (
        SELECT
          m.id AS match_id,
          me.team_id,
          COUNT(*) AS foul_count
        FROM matches m
        JOIN match_events me ON me.match_id = m.id AND me.deleted = 0
        WHERE 
          m.folder_id = ?
          AND m.status = 'completed'
          AND m.deleted = 0
          AND me.event_type = 'foul'
        GROUP BY m.id, me.team_id
      ) fouls ON fouls.team_id = t.id
      WHERE t.deleted = 0
      GROUP BY t.id
      ORDER BY total_fouls ASC
      LIMIT 5;
    `);
    const stats = stmt.all(folderId, folderId);
    return stats;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch fewer fouls made teams by folder');
  }
};

const getTopFoulsMadePlayerByFolder = (folderId) => {
  try {
    const stmt = db.prepare(`
      SELECT
        p.id AS player_id,
        p.name AS player_name,
        COALESCE(NULLIF(TRIM(ft.custom_name), ''), t.name) AS team_name,
        COUNT(me.id) AS total_faltas
      FROM
        players p
        JOIN teams t ON p.team_id = t.id AND t.deleted = 0
        LEFT JOIN folders_teams ft ON ft.team_id = t.id AND ft.folder_id = p.folder_id AND ft.deleted = 0
        LEFT JOIN match_events me ON me.player_id = p.id
          AND me.event_type = 'foul'
          AND me.deleted = 0
      WHERE
        p.deleted = 0
        AND t.deleted = 0
        AND p.folder_id = ?
      GROUP BY
        p.id, p.name, team_name
      ORDER BY
        total_faltas DESC
      LIMIT 5;
    `);
    const stats = stmt.all(folderId);
    return stats;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch top fouls made teams by folder');
  }
};

const getFewerFoulsMadePlayerByFolder = (folderId) => {
  try {
    const stmt = db.prepare(`
      SELECT
        p.id AS player_id,
        p.name AS player_name,
        COALESCE(NULLIF(TRIM(ft.custom_name), ''), t.name) AS team_name,
        COUNT(me.id) AS total_faltas
      FROM
        players p
        JOIN teams t ON p.team_id = t.id AND t.deleted = 0
        LEFT JOIN folders_teams ft ON ft.team_id = t.id AND ft.folder_id = p.folder_id AND ft.deleted = 0
        LEFT JOIN match_events me ON me.player_id = p.id
          AND me.event_type = 'foul'
          AND me.deleted = 0
      WHERE
        p.deleted = 0
        AND t.deleted = 0
        AND p.folder_id = ?
      GROUP BY
        p.id, p.name, team_name
      ORDER BY
        total_faltas ASC, p.name ASC
      LIMIT 5;
    `);
    const stats = stmt.all(folderId);
    return stats;
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch fewer fouls made teams by folder');
  }
};

module.exports = {
  getStatsByMatch,
  getStatsByFolder,
  getPointsPerGameByFolder,
  getThreePointersMadeByFolder,
  getTopScorersTeamsByFolder,
  getFewerPointsAllowedTeamsByFolder,
  getFewerFoulsMadeTeamsByFolder,
  getTopFoulsMadePlayerByFolder,
  getFewerFoulsMadePlayerByFolder
};