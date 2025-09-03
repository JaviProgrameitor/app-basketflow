
import React from 'react';
import TeamStats from './TeamStats.jsx';
import PlayerStats from './PlayerStats.jsx';

function MainLeagueStats({ componentActive, setComponentActive, folderId }) {
  return (
    <main className='p-6 h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden'>
      <div className='max-w-4xl mx-auto'>
        <div className='grid grid-cols-2'>
          <div onClick={() => setComponentActive('teams')} className={`text-center border-b-2 py-2 cursor-pointer ${componentActive === 'teams' ? 'text-blue-700 font-bold border-blue-700' : 'border-gray-200'}`}>
            Equipos
          </div>
          <div onClick={() => setComponentActive('players')} className={`text-center border-b-2 py-2 cursor-pointer ${componentActive === 'players' ? 'text-blue-700 font-bold border-blue-700' : 'border-gray-200'}`}>
            Jugadores
          </div>
        </div>
        {componentActive === 'teams' && (
          <TeamStats folderId={folderId} />
        )}

        {componentActive === 'players' && (
          <PlayerStats folderId={folderId} />
        )}
      </div>
    </main>
  );
}

export default MainLeagueStats;