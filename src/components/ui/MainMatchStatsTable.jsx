
import React from 'react';
import Table from './Table.jsx';

const MainMatchStatsTable = ({sortedPlayers, sortBy, setSortBy, columns}) => {
  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="flex gap-4 mb-3">
        <button
          onClick={() => setSortBy("points")}
          className={`px-3 py-1 rounded ${sortBy === "points" ? "bg-blue-600 text-white font-semibold" : "bg-gray-200"}`}
        >
          Ordenar por Puntos
        </button>
        <button
          onClick={() => setSortBy("fouls")}
          className={`px-3 py-1 rounded ${sortBy === "fouls" ? "bg-red-600 text-white font-semibold" : "bg-gray-200"}`}
        >
          Ordenar por Faltas
        </button>
      </div>
      <Table
        data={sortedPlayers}
        columns={columns}
        indexColumn={true}
      />
    </main>
  )
} 

export default MainMatchStatsTable;