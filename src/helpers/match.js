
function calculatePoints(points = []) {
  let accumulated = 0;
  const pointsTotal = {};
  for (let i = 0; i < 35; i++) {
    if (points[i]) {
      pointsTotal[accumulated + points[i].point_value] = points[i];
      accumulated += points[i].point_value;
    }
  }
  return { accumulated, pointsTotal };
}

function generateRoundRobin(equiposArr = []) {
  const equipos = equiposArr.slice(); // Copiamos el arreglo para no modificar el original

  // Si hay un número impar de equipos, agregamos un BYE (descanso)
  const esImpar = equipos.length % 2 !== 0;
  if (esImpar) equipos.push("BYE");

  const numEquipos = equipos.length;
  const numJornadas = numEquipos - 1;
  const partidosPorJornada = numEquipos / 2;
  const rol = [];

  // Generar partidos de ida
  for (let j = 0; j < numJornadas; j++) {
    const jornada = [];
    for (let i = 0; i < partidosPorJornada; i++) {
      const local = equipos[i];
      const visitante = equipos[numEquipos - 1 - i];
      if (local !== "BYE" && visitante !== "BYE") {
        jornada.push({ 
          home_team_id: local.id,
          home_team_name: local.name,
          away_team_id: visitante.id,
          away_team_name: visitante.name,
          date: '',
          time_start: '',
          location: '',
          published: false,
          round: j + 1
        });
      }
    }
    rol.push(jornada);

    // Rotar los equipos (excepto el primero)
    equipos.splice(1, 0, equipos.pop());
  }

  // Generar partidos de vuelta (invirtiendo local y visitante)
  const rolVuelta = rol.map(jornada =>
    jornada.map(partido => ({
      home_team_id: partido.away_team_id,
      home_team_name: partido.away_team_name,
      away_team_id: partido.home_team_id,
      away_team_name: partido.home_team_name,
      date: partido.date,
      time_start: partido.time_start,
      location: partido.location,
      published: partido.published,
      round: partido.round + numJornadas // Incrementamos el número de ronda para los partidos de vuelta
    }))
  );

  // Unimos los partidos de ida y vuelta
  return rol.concat(rolVuelta);
}

export {
  calculatePoints,
  generateRoundRobin,
}