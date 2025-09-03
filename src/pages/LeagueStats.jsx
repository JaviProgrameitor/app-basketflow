
import React, { useState } from 'react'
import { useParams } from 'react-router';
import HeaderView from '../components/ui/HeaderView.jsx';
import MainLeagueStats from '../components/ui/MainLeagueStats.jsx';

function LeagueStats() {

  const [componentActive, setComponentActive] = useState('teams');
  const { folder_id } = useParams();

  return (
    <div>
      {/* Header */}
      <HeaderView title={'Estadísticas de la Liga'} back={`/matches/${folder_id}`} />
      
      {/* Main Content */}
      <MainLeagueStats componentActive={componentActive} setComponentActive={setComponentActive} folderId={folder_id} />
    </div>
  );
}

export default LeagueStats;