
import React from 'react';

const MainMatchEventsTimeline = ({filteredEvents, eventTypes, filter, setFilter}) => {
  return (
    <div className='p-6'>
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="filter" className="font-semibold">Filtrar:</label>
        <select
          id="filter"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="all">Todos</option>
          {eventTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>
      <ul className="space-y-2">
        {filteredEvents.map((ev, idx) => (
          <li
            key={idx}
            className="border-l-4 bg-gray-50 hover:bg-gray-100 transition flex flex-col px-4 py-2 relative"
            style={{
              borderColor: ev.team_color || "#888"
            }}
          >
            <div className={`${ev.name ? 'grid grid-cols-3 grid-rows-1' : 'flex items-center justify-between gap-2'} `}>
              <span className="text-xs text-gray-500 font-mono">[{ev.minute || ""}&apos;]</span>
              <span
                className="font-semibold text-center text-sm lg:text-base"
                style={{ color: ev.team_color || "#333" }}
              >
                {ev.team_name}
              </span>
              {ev.name && (
                <span className="ml-2 text-gray-700 text-right text-sm lg:text-base">{ev.name}</span>
              )}
            </div>
            <div className="mt-1 text-sm">
              {ev.event_type === "point" && (
                <span className="inline-flex items-center gap-1 text-blue-800 font-bold">
                  <span role="img" aria-label="Canasta">🏀</span>
                  Canasta de {ev.point_value} pts
                </span>
              )}
              {ev.event_type === "foul" && (
                <span className="inline-flex items-center gap-1 text-red-700 font-semibold">
                  <span role="img" aria-label="Falta">🚫</span>
                  Falta{ev.foul_type ? ` (${ev.foul_type})` : ""}
                </span>
              )}
              {ev.event_type === "timeout" && (
                <span className="inline-flex items-center gap-1 text-yellow-700 font-semibold">
                  <span role="img" aria-label="Tiempo muerto">⏱️</span>
                  Tiempo muerto
                </span>
              )}
              {/* Otros tipos de evento */}
              {["point", "foul", "timeout"].indexOf(ev.event_type) === -1 && (
                <span className="inline-flex items-center gap-1 text-gray-600">
                  {ev.event_type}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MainMatchEventsTimeline;