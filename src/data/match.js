
const matchStates = {
  scheduled: {
    label: 'Programado',
    bg: 'bg-gray-100',
    color: 'text-gray-800',
  },
  playing: {
    label: 'En Juego',
    bg: 'bg-yellow-100',
    color: 'text-yellow-800',
  },
  finalizing: {
    label: 'Finalizando',
    bg: 'bg-blue-100',
    color: 'text-blue-800'
  },
  completed: {
    label: 'Finalizado',
    bg: 'bg-green-100',
    color: 'text-green-800'
  },
};

const predefinedCauses = [
  "Error de anotación",
  "Duplicado",
  "Evento inválido"
];

const typesParticipation = {
  starter: {
    label: 'Titular',
    value: 'starter'
  },
  substitute: {
    label: 'Suplente',
    value: 'substitute'
  },
  did_not_play: {
    label: 'No Jugó',
    value: 'did_not_play'
  }
}

const times = [
  '1er Cuarto - 1era Mitad',
  '2do Cuarto - 1era Mitad',
  '3er Cuarto - 2da Mitad',
  '4to Cuarto - 2da Mitad',
  'Tiempo Extra'
]

const quartersToHalfs = {
  1: [1, 2],
  2: [1, 2],
  3: [3, 4],
  4: [3, 4],
  5: [5, 5]
}

const allowedTimeouts = [2, 2, 3, 3, 3]

const typesPoints = [
  { name: 'Simple', value: 1, type: 'simple' },
  { name: 'Doble', value: 2, type: 'double' },
  { name: 'Triple', value: 3, type: 'triple' },
]

const colorQuarter = {
  1: {
    text: 'text-red-500',
    bg: 'bg-red-500',
    border: 'border-red-500',
    hex: '#fb2c36',
    textBasic: 'text-red',
    bgBasic: 'bg-red',
    borderBasic: 'border-red',
  },
  2: {
    text: 'text-blue-500',
    bg: 'bg-blue-500',
    border: 'border-blue-500',
    hex: '#2b7fff',
    textBasic: 'text-blue',
    bgBasic: 'bg-blue',
    borderBasic: 'border-blue',
  },
  3: {
    text: 'text-red-500',
    bg: 'bg-red-500',
    border: 'border-red-500',
    hex: '#fb2c36',
    textBasic: 'text-red',
    bgBasic: 'bg-red',
    borderBasic: 'border-red',
  },
  4: {
    text: 'text-blue-500',
    bg: 'bg-blue-500',
    border: 'border-blue-500',
    hex: '#2b7fff',
    textBasic: 'text-blue',
    bgBasic: 'bg-blue',
    borderBasic: 'border-blue',
  },
  5: {
    text: 'text-red-500',
    bg: 'bg-red-500',
    border: 'border-red-500',
    hex: '#fb2c36',
    textBasic: 'text-red',
    bgBasic: 'bg-red',
    borderBasic: 'border-red',
  }
}

const typesFouls = [
  'P',
  'P1',
  'P2',
  'P3'
]

const determinateSymbolPoint = (pointValue, quarter) => {

  switch (pointValue) {
    case 1:
      return `<div class="simple-point ${colorQuarter[quarter]?.bgBasic}"></div>`;
    case 2:
      return `<svg class="box-diagonal" viewBox="0 0 17 17">
                <line x1="0" y1="17" x2="17" y2="0" stroke="${colorQuarter[quarter]?.hex}" stroke-width="2" />
              </svg>`;
    case 3:
      return `<div class="circle ${colorQuarter[quarter]?.borderBasic}"></div>`;
    default:
      return '';
  }
}

const determinateSymbolParticipation = (participation) => {
  switch (participation) {
    case 'starter':
      return `
              <div style="width: 85%; height: 85%; position: absolute; top: 0; left: 0; border-radius: 999999px; border-width: 2px; border-style: solid; border-color: black;">
                <span style="font-weight: bold;">X</span>
              </div>
              `;
    case 'substitute':
      return `<span style="font-weight: bold;">X</span>`;
    case 'did_not_play':
      return `<span style="font-weight: bold;"></span>`;
    default:
      return `<span style="font-weight: bold;"></span>`;
  }
}

const templateGameReport = (matchData, imageSrc) => {
  const html = `
    <!DOCTYPE html>
    <html lang="es">

      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
        <title>Reporte de Partido</title>
        <style>

          .circle {
            width: 83%;
            height: 83%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 999999px;
            border-width: 2px;
            border-style: solid;
          }

          .box-diagonal {
            width: 17px;
            height: 17px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          .simple-point {
            width: 8px;
            height: 8px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 999999px;
          }

          .px-03cm {
            padding-left: 0.3cm;
            padding-right: 0.3cm;
          }

          .flex {
            display: flex;
          }

          .flex-col {
            flex-direction: column;
          }

          .justify-center {
            justify-content: center;
          }

          .justify-between {
            justify-content: space-between;
          }

          .justify-around {
            justify-content: space-around;
          }

          .justify-end {
            justify-content: flex-end;
          }

          .items-center {
            align-items: center;
          }

          .flex-1 {
            flex: 1;
          }

          .m-0 {
            margin: 0;
          }

          .w-full {
            width: 100%;
          }

          .h-full {
            height: 100%;
          }

          .h-05cm {
            height: 0.57cm;
          }

          .size-05cm {
            width: 0.5cm;
            height: 0.5cm;
            box-sizing: border-box;
          }

          .text-blue {
            color: blue;
          }

          .text-red {
            color: red;
          }

          .bg-red {
            background-color: red;
          }

          .bg-blue {
            background-color: blue;
          }

          .border-red {
            border-color: red;
          }

          .border-blue {
            border-color: blue;
          }

          .text-bold {
            font-weight: bold;
          }

          .text-center {
            text-align: center;
          }

          .text-10px {
            font-size: 10px;
          }

          .border-2 {
            border: 2px solid black;
          }

          .border-collapse {
            border-collapse: collapse;
          }

          .p-0 {
            padding: 0;
          }

          .relative {
            position: relative;
          }

          .border-box {
            box-sizing: border-box;
          }

          /* Estilos Específicos */
          .paper {
            width: 100vw;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            font-family: "Roboto", sans-serif;
          }

          .page-break {
            page-break-before: always;
          }

          .box-line {
            position: relative;
          }

          .box-line_text {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            font-size: 11px;
            text-align: center;
            font-weight: bold;
            text-overflow: clip;
            text-transform: uppercase;
          }

          .main-container {
            width: 18.5cm;
            height: 30.5cm;
            display: flex;
            flex-direction: column;
            border: 2px solid black;
            margin: 0 auto;
          }

          .header {
            width: 100%;
            height: 2.3cm;
            border-bottom: 2px solid black;
            display: flex;
            flex-direction: column;
          }

          .header_enterprise {
            height: 0.7cm;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-right: 1cm;
            box-sizing: border-box;
          }

          .header_enterprise_logo {
            height: 100%;
            width: auto;
          }

          .header_enterprise_title {
            font-size: 12px;
            font-weight: bolder;
          }

          .header_enterprise_folio {
            font-size: 12px;
            color: red;
            font-weight: bold;
          }

          .header_info {
            flex: 1;
            display: flex;
            flex-direction: column;
            padding: 0 0.3cm;
          }

          .header_info_subtitle {
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            margin: 0;
            padding: 0;
          }

          /* main */
          .main {
            flex: 1;
            display: flex;
          }

          .main_teams {
            width: 8.7cm;
            height: 100%;
            border-right: 2px solid black;

            display: grid;
            grid-template-columns: repeat(1, 1fr);
            grid-template-rows: repeat(2, 1fr);
          }

          .main_teams_data {
            border-bottom: 2px solid black;
          }

          .main_teams_name {
            height: 0.4cm;
            border-bottom: 2px solid black;
          }

          .main_teams_events {
            height: 2.9cm;
          }

          .main_teams_events_timeouts {
            width: 2.5cm;
            height: 100%;
          }

          /* footer */
          .footer {
            width: 100%;
            height: 4.2cm;
            border-top: 2px solid black;
            font-size: 10px;
            display: flex;
          }

          .footer_info {
            width: 377.953px;
            height: 100%;
            border-right: 2px solid black;
            flex-shrink: 0
          }

          .footer_info_1,
          .footer_scorer_1 {
            height: 2.2cm;
            border-bottom: 2px solid black;
          }

          .footer_info_1 p,
          .footer_info_2 p {
            margin: 2px 0;
          }

          .footer_info_2, .footer_scorer-2 {
            height: 1.4cm;
            border-bottom: 2px solid black;
          }

          .footer_scorer {
            flex: 1;
          }

          .footer_scorer_quarters {
            padding-right: 5px;
          }

          .footer_scorer_quarters p {
            padding-left: 1cm;
          }

          .footer_scorer_quarters p:nth-child(5) {
            padding-left: 0.3cm;
          }
        </style>
      </head>

      <body>
        <div class="paper">
          <div class="main-container">
            <div class="header">
              <div class="header_enterprise">
                <img class="header_enterprise_logo" src="${imageSrc}" alt="Logo Fiba" />
                <h1 class="header_enterprise_title">FEDERACION INTERNACIONAL DE BASQUETBOL</h1>
                <span class="header_enterprise_folio">FOLIO ______</span>
              </div>
              <div class="header_info">
                <h2 class="header_info_subtitle">PLANILLA DE JUEGO</h2>
                <div class="header_info_teams">
                  <span class="header_info_team1">
                    EQUIPO A:
                    <span class="box-line">
                      ___________________________________________________
                      <span class="box-line_text">${matchData.home_team_name}</span>
                    </span>
                  </span>
                  <span class="header_info_team2">
                    EQUIPO B:
                    <span class="box-line">
                      ___________________________________________________
                      <span class="box-line_text">${matchData.away_team_name}</span>
                    </span>
                  </span>
                </div>
                <div class="header_info_details">
                  <span class="header_info_competition">
                    COMPETENCIA:
                    <span class="box-line">
                      _______________________________
                      <span class="box-line_text">${matchData.name_tournament}</span>
                    </span>
                  </span>
                  <span class="header_info_date">
                    FECHA:
                    <span class="box-line">
                      ______________
                      <span class="box-line_text">${matchData.date}</span>
                    </span>
                  </span>
                  <span class="header_info_location">
                    HORA:
                    <span class="box-line">
                      _________
                      <span class="box-line_text">${matchData.time_start}</span>
                    </span>
                  </span>
                  <span class="header_info_location">
                    ÁRBITRO PRINCIPAL:
                    <span class="box-line">
                      ________________
                      <span class="box-line_text">${matchData.referee_main}</span>
                    </span>
                  </span>
                </div>
                <div class="header_info_details">
                  <span class="header_info_game">
                    JUEGO No:
                    <span class="box-line">
                      _____
                      <span class="box-line_text">${matchData.number_game}</span>
                    </span>
                  </span>
                  <span class="header_info_place">
                    LUGAR:
                    <span class="box-line">
                      ____________________________
                      <span class="box-line_text">${matchData.location}</span>
                    </span>
                  </span>
                  <span class="header_info_referee">
                    ÁRBITRO 1:
                    <span class="box-line">
                      _______________________
                      <span class="box-line_text">${matchData?.referee1}</span>
                    </span>
                  </span>
                  <span class="header_info_referee">
                    ÁRBITRO 2:
                    <span class="box-line">
                      _______________________
                      <span class="box-line_text">${matchData?.referee2}</span>
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <main class="main flex">
              <div class="main_teams">
                <div class='main_teams_data flex flex-col'>
                  <p class="m-0 text-bold main_teams_name">
                    EQUIPO "A":
                    <span class="box-line">
                      _______________________________________________
                      <span class="box-line_text">${matchData.home_team_name}</span>
                    </span>
                  </p>
                  <div class="main_teams_events flex">
                    <div class="main_teams_events_timeouts flex flex-col">
                      <span class='text-10px' style="height: 0.5cm">TIEMPOS FUERA</span>
                      <div class="flex-1">
                        <table class='border-collapse'>
                          <tbody>
                            <tr>
                              <td class='text-10px text-bold'>1M</td>
                              ${
                                Array.from({ length: 2 }).map((_, i) => {
                                  const timeout = matchData.timeoutsHome.filter((timeout) => timeout.period === 1 || timeout.period === 2);
                                  return(
                                  `<td class='size-05cm border-2 relative'>
                                    ${timeout[i] ? determinateSymbolPoint(2, timeout[i].period) : ''}
                                  </td>`
                                )
                                }).join('')
                              }
                            </tr>
                            <tr>
                              <td class='text-10px text-bold'>2M</td>
                              ${
                                Array.from({ length: 3 }).map((_, i) => {
                                  const timeout = matchData.timeoutsHome.filter((timeout) => timeout.period === 3 || timeout.period === 4);
                                  return (
                                  `<td key={i} class='size-05cm border-2 relative'>
                                    ${timeout[i] ? determinateSymbolPoint(2, timeout[i].period) : ''}
                                  </td>`
                                )
                                }).join('')
                              }
                            </tr>
                            <tr>
                              <td class='text-10px text-bold'>TE</td>
                              ${
                                Array.from({ length: 3 }).map((_, i) => {
                                  const timeout = matchData.timeoutsHome.filter((timeout) => timeout.period === 5);
                                  return (
                                    `<td key={i} class='size-05cm border-2 relative'>
                                      ${timeout[i] ? determinateSymbolPoint(2, timeout[i].period) : ''}
                                    </td>`
                                  )
                                }).join('')
                              }
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div class='flex-1'>
                      <p class='text-10px text-bold m-0 text-center' style="height: 0.5cm">FOULS DE EQUIPO</p>
                      <div class='flex justify-around'>
                        <table class='border-collapse'>
                          <tbody>
                            <tr>
                              <td class='text-10px text-bold'>Q1</td>
                              ${
                                Array.from({ length: 4 }).map((_, i) => {
                                  const foul = matchData.foulsHome.filter((foul) => foul.period === 1);

                                  return (
                                    `<td key={i} class='size-05cm border-2 text-center text-bold relative'>
                                      ${i + 1}
                                      ${foul[i] ? determinateSymbolPoint(2, foul[i].period) : ''}
                                    </td>`
                                  )
                                }).join('')
                              }
                            </tr>
                            <tr>
                              <td class='text-10px text-bold'>Q3</td>
                              ${
                                Array.from({ length: 4 }).map((_, i) => {
                                  const foul = matchData.foulsHome.filter((foul) => foul.period === 3);
                                  return (
                                    `<td key={i} class='size-05cm border-2 text-center text-bold relative'>
                                      ${i + 1}
                                      ${foul[i] ? determinateSymbolPoint(2, foul[i].period) : ''}
                                    </td>`
                                  )
                                }).join('')
                              }
                            </tr>
                            <tr>
                              <td></td>
                              <td colSpan="2" class='text-10px text-bold'>HCC</td>
                              ${
                                Array.from({ length: 2 }).map((_, i) => {
                                  
                                  return (
                                    `<td key={i} class='size-05cm border-2 relative'>
                                    
                                    </td>`
                                  )
                                }).join('')
                              }
                            </tr>
                          </tbody>
                        </table>
                        <table class='border-collapse'>
                          <tbody>
                            <tr>
                              <td class='text-10px text-bold'>Q2</td>
                              ${
                                Array.from({ length: 4 }).map((_, i) => {
                                  const foul = matchData.foulsHome.filter((foul) => foul.period === 2);
                                  return (
                                    `<td class='size-05cm border-2 text-center text-bold relative'>
                                      ${i + 1}
                                      ${foul[i] ? determinateSymbolPoint(2, foul[i].period) : ''}
                                    </td>`
                                  )
                                }).join('')
                              }
                            </tr>
                            <tr>
                              <td class='text-10px text-bold'>Q4</td>
                              ${
                                Array.from({ length: 4 }).map((_, i) => {
                                  const foul = matchData.foulsHome.filter((foul) => foul.period === 4);
                                  return (
                                    `<td class='size-05cm border-2 text-center text-bold relative'>
                                      ${i + 1}
                                      ${foul[i] ? determinateSymbolPoint(2, foul[i].period) : ''}
                                    </td>`
                                  )
                                }).join('')
                              }
                            </tr>
                            <tr>
                              <td></td>
                              <td colSpan="2" class='text-10px text-bold'></td>
                              ${
                                Array.from({ length: 2 }).map((_, i) => (
                                  `<td >

                                  </td>`
                                )).join('')
                              }
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div class='flex-1'>
                    <table class='border-collapse'>
                      <thead>
                        <tr>
                          <th class='border-2 size-05cm border-box border-left-0'>ID</th>
                          <th class='text-bold border-2' style="width: 4cm">NOMBRE JUGADOR</th>
                          <th class='text-bold border-2' style="width: 1cm">N°</th>
                          <th class='border-2 size-05cm border-box'>E</th>
                          <th class='border-2 size-05cm border-box'>1</th>
                          <th class='border-2 size-05cm border-box'>2</th>
                          <th class='border-2 size-05cm border-box'>3</th>
                          <th class='border-2 size-05cm border-box'>4</th>
                          <th class='border-2 size-05cm border-box border-right-0'>5</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${
                          Array.from({ length: 12 }).map((_, i) => {
                            const players = matchData.players.filter((player) => player.team_id === matchData.home_team_id);
                            const fouls = matchData.foulsHome.filter((foul) => foul.player_id === players[i]?.player_id);
                            return (
                              `<tr>
                                <td class='border-2 border-box h-05cm text-center border-left-0'>${players[i] ? i + 1 : ''}</td>
                                <td class='border-2 relative border-box h-05cm'>${players[i]?.player_name || ''}</td>
                                <td class='border-2 relative border-box h-05cm text-center'>${players[i]?.jersey_number || ''}</td>
                                <td class='border-2 relative border-box h-05cm text-center'>${determinateSymbolParticipation(players[i]?.participation || '') || ''}</td>
                                <td class='border-2 relative border-box h-05cm text-center ${fouls[0]?.period === 1 || fouls[0]?.period === 3 ? 'text-red' : 'text-blue'}'>
                                  ${fouls[0]?.foul_type || ''}
                                </td>
                                <td class='border-2 relative border-box h-05cm text-center ${fouls[1]?.period === 1 || fouls[1]?.period === 3 ? 'text-red' : 'text-blue'}'>
                                  ${fouls[1]?.foul_type || ''}
                                </td>
                                <td class='border-2 relative border-box h-05cm text-center ${fouls[2]?.period === 1 || fouls[2]?.period === 3 ? 'text-red' : 'text-blue'}'>
                                  ${fouls[2]?.foul_type || ''}
                                </td>
                                <td class='border-2 relative border-box h-05cm text-center ${fouls[3]?.period === 1 || fouls[3]?.period === 3 ? 'text-red' : 'text-blue'}'>
                                  ${fouls[3]?.foul_type || ''}
                                </td>
                                <td class='border-2 relative border-box h-05cm text-center border-right-0 ${fouls[4]?.period === 1 || fouls[4]?.period === 3 ? 'text-red' : 'text-blue'}'>
                                  ${fouls[4]?.foul_type || ''}
                                </td>
                              </tr>`
                            )
                          }).join('')
                        }
                      </tbody>
                    </table>
                    <table class='border-collapse'>
                      <tbody>
                        <tr>
                          <td class='size-05cm border-2 border-top-0 border-box border-left-0'></td>
                          <td class='h-05cm border-2 border-top-0 border-box text-bold' style="width: 2.6cm">Entrenador</td>
                          <td class='border-2 border-top-0 size-05cm'></td>
                          <td class='border-2 border-top-0' style="width: 3.5cm">${matchData?.home_team_coach}</td>
                          <td class="border-2 border-top-0 size-05cm"></td>
                          <td class="border-2 border-top-0 size-05cm"></td>
                          <td class="border-2 border-top-0 size-05cm border-right-0"></td>
                        </tr>
                        <tr>
                          <td class='size-05cm border-2 border-bottom-0 border-box border-left-0'></td>
                          <td class='h-05cm border-2 border-bottom-0 border-box text-bold' style="width: 2.6cm">1 Ent. Asistente</td>
                          <td class='border-2 border-bottom-0 size-05cm'></td>
                          <td class='border-2 border-bottom-0' style="width: 3.44cm">${matchData?.home_team_assistant_coach}</td>
                          <td class="border-2 border-bottom-0 size-05cm"></td>
                          <td class="border-2 border-bottom-0 size-05cm"></td>
                          <td class="border-2 border-bottom-0 size-05cm border-right-0"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class='flex flex-col'>
                  <p class="m-0 text-bold main_teams_name">
                    EQUIPO "B":
                    <span class="box-line">
                      _______________________________________________
                      <span class="box-line_text">${matchData.away_team_name}</span>
                    </span>
                  </p>
                  <div class="main_teams_events flex">
                    <div class="main_teams_events_timeouts flex flex-col">
                      <span class='text-10px' style="height: 0.5cm">TIEMPOS FUERA</span>
                      <div class="flex-1">
                        <table class='border-collapse'>
                          <tbody>
                            <tr>
                              <td class='text-10px text-bold'>1M</td>
                              ${
                                Array.from({ length: 2 }).map((_, i) => {
                                  const timeout = matchData.timeoutsAway.filter((timeout) => timeout.period === 1 || timeout.period === 2);
                                  return (
                                    `<td class='size-05cm border-2 relative'>
                                      ${timeout[i] ? determinateSymbolPoint(2, timeout[i].period) : ''}
                                    </td>`
                                  )
                                }).join('')
                              }
                            </tr>
                            <tr>
                              <td class='text-10px text-bold'>2M</td>
                              ${
                                Array.from({ length: 3 }).map((_, i) => {
                                  const timeout = matchData.timeoutsAway.filter((timeout) => timeout.period === 3 || timeout.period === 4);
                                  return (
                                    `<td class='size-05cm border-2 relative'>
                                      ${timeout[i] ? determinateSymbolPoint(2, timeout[i].period) : ''}
                                    </td>`
                                  )
                                }).join('')
                              }
                            </tr>
                            <tr>
                              <td class='text-10px text-bold'>TE</td>
                              ${
                                Array.from({ length: 3 }).map((_, i) => {
                                  const timeout = matchData.timeoutsAway.filter((timeout) => timeout.period === 5);
                                  return (
                                    `<td class='size-05cm border-2 relative'>
                                      ${timeout[i] ? determinateSymbolPoint(2, timeout[i].period) : ''}
                                    </td>`
                                  )
                                }).join('')
                              }
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div class='flex-1'>
                      <p class='text-10px text-bold m-0 text-center' style="height: 0.5cm">FOULS DE EQUIPO</p>
                      <div class='flex justify-around'>
                        <table class='border-collapse'>
                          <tbody>
                            <tr>
                              <td class='text-10px text-bold'>Q1</td>
                              ${
                                Array.from({ length: 4 }).map((_, i) => {
                                  const foul = matchData.foulsAway.filter((foul) => foul.period === 1);
                                  return (
                                    `<td class='size-05cm border-2 text-center text-bold relative'>
                                      ${i + 1}
                                      ${foul[i] ? determinateSymbolPoint(2, foul[i].period) : ''}
                                    </td>`
                                  )
                                }).join('')
                              }
                            </tr>
                            <tr>
                              <td class='text-10px text-bold'>Q3</td>
                              ${
                                Array.from({ length: 4 }).map((_, i) => {
                                  const foul = matchData.foulsAway.filter((foul) => foul.period === 3);
                                  return (
                                    `<td class='size-05cm border-2 text-center text-bold relative'>
                                      ${i + 1}
                                      ${foul[i] ? determinateSymbolPoint(2, foul[i].period) : ''}
                                    </td>`
                                  )
                                }).join('')
                              }
                            </tr>
                            <tr>
                              <td></td>
                              <td colSpan="2" class='text-10px text-bold'>HCC</td>
                              ${
                                Array.from({ length: 2 }).map((_, i) => {
                                  
                                  return (
                                    `<td class='size-05cm border-2 relative'>

                                    </td>`
                                  )
                                }).join('')
                              }
                            </tr>
                          </tbody>
                        </table>
                        <table class='border-collapse'>
                          <tbody>
                            <tr>
                              <td class='text-10px text-bold'>Q2</td>
                              ${
                                Array.from({ length: 4 }).map((_, i) => {
                                  const foul = matchData.foulsAway.filter((foul) => foul.period === 2);
                                  return (
                                    `<td class='size-05cm border-2 text-center text-bold relative'>
                                      ${i + 1}
                                      ${foul[i] ? determinateSymbolPoint(2, foul[i].period) : ''}
                                    </td>`
                                  )
                                }).join('')
                              }
                            </tr>
                            <tr>
                              <td class='text-10px text-bold'>Q4</td>
                              ${
                                Array.from({ length: 4 }).map((_, i) => {
                                  const foul = matchData.foulsAway.filter((foul) => foul.period === 4);
                                  return (
                                    `<td class='size-05cm border-2 text-center text-bold relative'>
                                      ${i + 1}
                                      ${foul[i] ? determinateSymbolPoint(2, foul[i].period) : ''}
                                    </td>`
                                  )
                                }).join('')
                              }
                            </tr>
                            <tr>
                              <td></td>
                              <td colSpan="2" class='text-10px text-bold'></td>
                              ${
                                Array.from({ length: 2 }).map((_, i) => (
                                  `<td>

                                  </td>`
                                )).join('')
                              }
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div class='flex-1'>
                    <table class='border-collapse'>
                      <thead>
                        <tr>
                          <th class='border-2 size-05cm border-box border-left-0'>ID</th>
                          <th class='text-bold border-2' style="width: 4cm">NOMBRE JUGADOR</th>
                          <th class='text-bold border-2' style="width: 1cm">N°</th>
                          <th class='border-2 size-05cm border-box'>E</th>
                          <th class='border-2 size-05cm border-box'>1</th>
                          <th class='border-2 size-05cm border-box'>2</th>
                          <th class='border-2 size-05cm border-box'>3</th>
                          <th class='border-2 size-05cm border-box'>4</th>
                          <th class='border-2 size-05cm border-box border-right-0'>5</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${
                          Array.from({ length: 12 }).map((_, i) => {
                            const players = matchData.players.filter((player) => player.team_id === matchData.away_team_id);
                            const fouls = matchData.foulsAway.filter((foul) => foul.player_id === players[i]?.player_id);
                            return (
                              `<tr>
                                <td class='border-2 border-box h-05cm text-center border-left-0'>${players[i] ? i + 1 : ''}</td>
                                <td class='border-2 relative border-box h-05cm'>${players[i]?.player_name || ''}</td>
                                <td class='border-2 relative border-box h-05cm text-center'>${players[i]?.jersey_number || ''}</td>
                                <td class='border-2 relative border-box h-05cm text-center'>${determinateSymbolParticipation(players[i]?.participation || '') || ''}</td>
                                <td class='border-2 relative border-box h-05cm text-center ${fouls[0]?.period === 1 || fouls[0]?.period === 3 ? 'text-red' : 'text-blue'}'>
                                  ${fouls[0]?.foul_type || ''}
                                </td>
                                <td class='border-2 relative border-box h-05cm text-center ${fouls[1]?.period === 1 || fouls[1]?.period === 3 ? 'text-red' : 'text-blue'}'>
                                  ${fouls[1]?.foul_type || ''}
                                </td>
                                <td class='border-2 relative border-box h-05cm text-center ${fouls[2]?.period === 1 || fouls[2]?.period === 3 ? 'text-red' : 'text-blue'}'>
                                  ${fouls[2]?.foul_type || ''}
                                </td>
                                <td class='border-2 relative border-box h-05cm text-center ${fouls[3]?.period === 1 || fouls[3]?.period === 3 ? 'text-red' : 'text-blue'}'>
                                  ${fouls[3]?.foul_type || ''}
                                </td>
                                <td class='border-2 relative border-box h-05cm text-center border-right-0 ${fouls[4]?.period === 1 || fouls[4]?.period === 3 ? 'text-red' : 'text-blue'}'>
                                  ${fouls[4]?.foul_type || ''}
                                </td>
                              </tr>`
                            )
                          }).join('')
                        }
                      </tbody>
                    </table>
                    <table class='border-collapse'>
                      <tbody>
                        <tr>
                          <td class='size-05cm border-2 border-box border-left-0'></td>
                          <td class='h-05cm border-2 border-box text-bold' style="width: 2.6cm">Entrenador</td>
                          <td class='border-2 size-05cm'></td>
                          <td class='border-2' style="width: 3.5cm">${matchData?.away_team_coach}</td>
                          <td class="border-2 size-05cm"></td>
                          <td class="border-2 size-05cm"></td>
                          <td class="border-2 size-05cm border-right-0"></td>
                        </tr>
                        <tr>
                          <td class='size-05cm border-2 border-bottom-0 border-box border-left-0'></td>
                          <td class='h-05cm border-2 border-bottom-0 border-box text-bold' style="width: 2.6cm">1 Ent. Asistente</td>
                          <td class='border-2 border-bottom-0 size-05cm'></td>
                          <td class='border-2 border-bottom-0' style="width: 3.44cm">${matchData?.away_team_assistant_coach}</td>
                          <td class="border-2 border-bottom-0 size-05cm"></td>
                          <td class="border-2 border-bottom-0 size-05cm"></td>
                          <td class="border-2 border-bottom-0 size-05cm border-right-0"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div class="main_points flex-1 flex flex-col">
                <div style="height: 0.4cm; border-bottom: 2px solid black">
                  <p class='text-bold m-0 text-center'>PUNTAJE PROGRESIVO</p>
                </div>
                  <div class='flex-1 flex flex-col'>
                    <div class='w-full main_points_header' style="height: 0.5cm; border-bottom: 2px solid black; display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px">
                      ${
                        Array.from({ length: 4 }).map((_, i) => (
                          `<div class='flex text-bold'>
                            <div 
                              class='flex-1 text-center flex justify-center items-center' 
                              style="border-right: 2px solid black; border-left: 2px solid black">A</div>
                            <div 
                              class='flex-1 text-center flex justify-center items-center' 
                              style="border-right: 2px solid black">B</div>
                          </div>`
                        )).join('')
                      }
                    </div>
                    <div class='flex-1 main_points_table' style="display: grid; grid-template-rows: repeat(40, 1fr); grid-template-columns: repeat(4, 1fr); grid-auto-flow: column; gap: 0 2px">
                      ${
                        Array.from({ length: 160 }).map((_, i) => {

                          const pointHome = matchData.pointsHome.pointsTotal[i + 1];
                          const pointAway = matchData.pointsAway.pointsTotal[i + 1];

                          return (
                            `<div class='flex text-bold' style="border-bottom: 2px solid black">
                              <div 
                                class='flex-1 flex' 
                                style="border-right: 2px solid black; border-left: 2px solid black; font-size: 10px"
                              >
                                <div class="flex-1 relative flex justify-center items-center ${colorQuarter[pointHome?.period]?.textBasic || ''}" style="border-right: 2px solid black">
                                  ${pointHome ? pointHome.jersey_number : ''}
                                </div>
                                <div class='flex-1 relative flex justify-center items-center'>
                                  ${i + 1}
                                  ${determinateSymbolPoint(pointHome?.point_value, pointHome?.period)}
                                </div>
                              </div>
                              <div 
                                class='flex-1 text-center flex' 
                                style="border-right: 2px solid black"
                              >
                                <div class='flex-1 relative flex justify-center items-center' style="border-right: 2px solid black; font-size: 10px">
                                  ${i + 1}
                                  ${determinateSymbolPoint(pointAway?.point_value, pointAway?.period)}
                                </div>
                                <div class='flex-1 relative flex justify-center items-center ${colorQuarter[pointAway?.period]?.textBasic || ''}'>${pointAway ? pointAway.jersey_number : ''}</div>
                              </div>
                            </div>`
                          )
                        }).join('')
                      }
                    </div>
                  </div>
              </div>
            </main>

            <div class="footer">
              <div class="footer_info flex flex-col">
                <div class="footer_info_1 px-03cm">
                  <p class="footer_info_annotator">
                    ANOTADOR:
                    <span class="box-line">
                      ____________________________________________________
                      <span class="box-line_text">${matchData.anotator}</span>
                    </span>
                  </p>
                  <p class="footer_info_timekeeper">
                    ASISTENTE DE ANOTADOR:
                    <span class="box-line">
                      _____________________________________
                      <span class="box-line_text">${matchData?.assistant_anotator}</span>
                    </span>
                  </p>
                  <p class="footer_info_timekeeper">
                    CRONOMETRISTA:
                    <span class="box-line">
                      ______________________________________________
                      <span class="box-line_text">${matchData?.timekeeper}</span>
                    </span>
                  </p>
                  <p class="footer_info_timekeeper">
                    OPERADOR RELOJ DE TIRO:
                    <span class="box-line">
                      ____________________________________
                      <span class="box-line_text">${matchData?.clock_operator}</span>
                    </span>
                  </p>
                </div>
                <div class="footer_info_2 px-03cm">
                  <p class="footer_info_signature">
                    ÁRBITRO PRINCIPAL:
                    <span class="box-line">
                      ____________________________________________
                      <span class="box-line_text"></span>
                    </span>
                  </p>
                  <div>
                    <span>
                      ÁRBITRO 1:
                      <span class="box-line">
                        ____________________
                        <span class="box-line_text"></span>
                      </span>
                    </span>
                    <span>
                      ÁRBITRO 2:
                      <span class="box-line">
                        ____________________
                        <span class="box-line_text"></span>
                      </span>
                    </span>
                  </div>
                </div>
                <div class="flex-1 flex flex-col justify-center px-03cm">
                  <span>
                    FIRMA DEL CAPITÁN EN CASO DE PROTESTA:
                    <span class="box-line">
                      ___________________
                      <span class="box-line_text"></span>
                    </span>
                  </span>
                </div>
              </div>
              <div class="footer_scorer flex flex-col">
                <div class="footer_scorer_1 flex">
                  <span>PUNTAJE</span>
                  <div class="footer_scorer_quarters flex-1 flex flex-col justify-between">
                    <p class="m-0 flex justify-between">
                      CUARTO 1
                      <span>
                        A:
                        <span class="box-line">
                          __________
                          <span class="box-line_text text-red">${matchData.home_p1_points}</span>
                        </span>
                      </span>
                      <span>
                        B:
                        <span class="box-line">
                          __________
                          <span class="box-line_text text-red">${matchData.away_p1_points}</span>
                        </span>
                      </span>
                    </p>
                    <p class="m-0 flex justify-between">
                      CUARTO 2
                      <span>
                        A:
                        <span class="box-line">
                          __________
                          <span class="box-line_text text-blue">${matchData.home_p2_points}</span>
                        </span>
                      </span>
                      <span>
                        B:
                        <span class="box-line">
                          __________
                          <span class="box-line_text text-blue">${matchData.away_p2_points}</span>
                        </span>
                      </span>
                    </p>
                    <p class="m-0 flex justify-between">
                      CUARTO 3
                      <span>
                        A:
                        <span class="box-line">
                          __________
                          <span class="box-line_text text-red">${matchData.home_p3_points}</span>
                        </span>
                      </span>
                      <span>
                        B:
                        <span class="box-line">
                          __________
                          <span class="box-line_text text-red">${matchData.away_p3_points}</span>
                        </span>
                      </span>
                    </p>
                    <p class="m-0 flex justify-between">
                      CUARTO 4
                      <span>
                        A:
                        <span class="box-line">
                          __________
                          <span class="box-line_text text-blue">${matchData.home_p4_points}</span>
                        </span>
                      </span>
                      <span>
                        B:
                        <span class="box-line">
                          __________
                          <span class="box-line_text text-blue">${matchData.away_p4_points}</span>
                        </span>
                      </span>
                    </p>
                    <p class="m-0 flex justify-between">
                      TIEMPO EXTRA
                      <span>
                        A:
                        <span class="box-line">
                          __________
                          <span class="box-line_text">${matchData.period == 5 ? matchData.home_p5_points : ''}</span>
                        </span>
                      </span>
                      <span>
                        B:
                        <span class="box-line">
                          __________
                          <span class="box-line_text">${matchData.period == 5 ? matchData.away_p5_points : ''}</span>
                        </span>
                      </span>
                    </p>
                  </div>
                </div>
                <div class="footer_scorer-2">
                  <p class="m-0">PUNTAJE FINAL</p>
                  <div class="flex justify-end">
                    <span>
                      EQUIPO A:
                      <span class="box-line">
                        __________
                        <span class="box-line_text">${matchData.home_team_final_points}</span>
                      </span>
                    </span>
                    <span>
                      EQUIPO B:
                      <span class="box-line">
                        __________
                        <span class="box-line_text">${matchData.away_team_final_points}</span>
                      </span>
                    </span>
                  </div>
                  <p class="m-0">
                    NOMBRE DEL EQUIPO GANADOR:
                    <span class="box-line">
                      ______________________________________________________________________
                      <span class="box-line_text">${matchData.winner_team_name}</span>
                    </span>
                  </p>
                </div>
                <div class="flex-1 flex flex-col justify-center">
                  <p class="m-0">
                    HORARIO FINAL DEL JUEGO:
                    <span class="box-line">
                      _________________________________________
                      <span class="box-line_text">${matchData.time_end}</span>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Segunda hoja: eventos eliminados -->
        <div class="paper">
          <div class="main-container" style="padding: 10px; border: 2px solid black;">
            <div class="header" style="height: auto; border-bottom: 2px solid black;">
              <div class="header_enterprise" style="height: auto; padding: 6px 1cm 6px 0.3cm;">
                <img style="height: 12px;" src="${imageSrc}" alt="Logo Fiba" />
                <h1 class="header_enterprise_title">FEDERACION INTERNACIONAL DE BASQUETBOL</h1>
                <span class="header_enterprise_folio">FOLIO ______</span>
              </div>
              <div class="header_info" style="padding-bottom: 8px;">
                <h2 class="header_info_subtitle">EVENTOS ELIMINADOS DEL PARTIDO</h2>
                <p class="deleted-events-subtitle">
                  Partido: <strong>${matchData.home_team_name}</strong> vs <strong>${matchData.away_team_name}</strong>
                  &nbsp;|&nbsp; Competencia: <strong>${matchData.name_tournament}</strong>
                  &nbsp;|&nbsp; Fecha: <strong>${matchData.date}</strong>
                </p>
              </div>
            </div>

            ${
              (matchData.deletedMatchEvents && matchData.deletedMatchEvents.length > 0)
              ? `
                <table class="table" style="margin-top: 8px;">
                  <thead>
                    <tr>
                      <th style="width: 28px;">#</th>
                      <th style="width: 110px;">Fecha/Hora</th>
                      <th style="width: 50px;">Período</th>
                      <th style="width: 120px;">Equipo</th>
                      <th style="width: 160px;">Jugador</th>
                      <th style="width: 45px;">N°</th>
                      <th style="width: 90px;">Tipo</th>
                      <th>Detalle</th>
                      <th style="width: 150px;">Causa</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${
                      matchData.deletedMatchEvents.map((ev, idx) => {
                        const detalle =
                          ev.event_type === 'point'
                            ? `${ev.point_type || ''} (${ev.point_value || 0})`
                            : ev.event_type === 'foul'
                              ? (ev.foul_type || 'Falta')
                              : ev.event_type === 'timeout'
                                ? `Min ${ev.minute ?? ''}`
                                : '';
                        return (`
                          <tr>
                            <td>${idx + 1}</td>
                            <td class="muted">${ev.created_at || ''}</td>
                            <td>${ev.period || ''}</td>
                            <td>${ev.team_name || ''}</td>
                            <td>${ev.name || ''}</td>
                            <td>${ev.jersey_number || ''}</td>
                            <td>${ev.event_type || ''}</td>
                            <td>${detalle}</td>
                            <td>${ev.cause || ''}</td>
                          </tr>
                        `);
                      }).join('')
                    }
                  </tbody>
                </table>
              `
              : `
                <div style="padding: 16px;">
                  <p class="deleted-events-title">No hay eventos eliminados</p>
                  <p class="deleted-events-subtitle">Durante este partido no se registraron eventos eliminados.</p>
                </div>
              `
            }
          </div>
        </div>
      </body>
    </html>
  `;

  return html;
}

// Segunda hoja del reporte
// <!-- Segunda hoja: eventos eliminados -->
//         <div class="page-break"></div>
//         <div class="paper">
//           <div class="main-container" style="padding: 10px; border: 2px solid black;">
//             <div class="header" style="height: auto; border-bottom: 2px solid black;">
//               <div class="header_enterprise" style="height: auto; padding: 6px 1cm 6px 0.3cm;">
//                 <img class="header_enterprise_logo" src="${imageSrc}" alt="Logo Fiba" />
//                 <h1 class="header_enterprise_title">FEDERACION INTERNACIONAL DE BASQUETBOL</h1>
//                 <span class="header_enterprise_folio">FOLIO ______</span>
//               </div>
//               <div class="header_info" style="padding-bottom: 8px;">
//                 <h2 class="header_info_subtitle">EVENTOS ELIMINADOS DEL PARTIDO</h2>
//                 <p class="deleted-events-subtitle">
//                   Partido: <strong>${matchData.home_team_name}</strong> vs <strong>${matchData.away_team_name}</strong>
//                   &nbsp;|&nbsp; Competencia: <strong>${matchData.name_tournament}</strong>
//                   &nbsp;|&nbsp; Fecha: <strong>${matchData.date}</strong>
//                 </p>
//               </div>
//             </div>

//             ${
//               (matchData.deletedMatchEvents && matchData.deletedMatchEvents.length > 0)
//               ? `
//                 <table class="table" style="margin-top: 8px;">
//                   <thead>
//                     <tr>
//                       <th style="width: 28px;">#</th>
//                       <th style="width: 110px;">Fecha/Hora</th>
//                       <th style="width: 50px;">Período</th>
//                       <th style="width: 120px;">Equipo</th>
//                       <th style="width: 160px;">Jugador</th>
//                       <th style="width: 45px;">N°</th>
//                       <th style="width: 90px;">Tipo</th>
//                       <th>Detalle</th>
//                       <th style="width: 150px;">Causa</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     ${
//                       matchData.deletedMatchEvents.map((ev, idx) => {
//                         const detalle =
//                           ev.event_type === 'point'
//                             ? `${ev.point_type || ''} (${ev.point_value || 0})`
//                             : ev.event_type === 'foul'
//                               ? (ev.foul_type || 'Falta')
//                               : ev.event_type === 'timeout'
//                                 ? `Min ${ev.minute ?? ''}`
//                                 : '';
//                         return (`
//                           <tr>
//                             <td>${idx + 1}</td>
//                             <td class="muted">${ev.created_at || ''}</td>
//                             <td>${ev.period || ''}</td>
//                             <td>${ev.team_name || ''}</td>
//                             <td>${ev.name || ''}</td>
//                             <td>${ev.jersey_number || ''}</td>
//                             <td>${ev.event_type || ''}</td>
//                             <td>${detalle}</td>
//                             <td>${ev.cause || ''}</td>
//                           </tr>
//                         `);
//                       }).join('')
//                     }
//                   </tbody>
//                 </table>
//               `
//               : `
//                 <div style="padding: 16px;">
//                   <p class="deleted-events-title">No hay eventos eliminados</p>
//                   <p class="deleted-events-subtitle">Durante este partido no se registraron eventos eliminados.</p>
//                 </div>
//               `
//             }
//           </div>
//         </div>

export {
  matchStates,
  times,
  allowedTimeouts,
  typesPoints,
  colorQuarter,
  typesFouls,
  quartersToHalfs,
  templateGameReport,
  predefinedCauses,
  typesParticipation
}
