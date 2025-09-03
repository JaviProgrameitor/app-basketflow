
import React from 'react';
import Table from './Table.jsx';

const MainLeagueRanking = ({columns, data}) => {
  return (
    <div className="p-6">
      <Table 
        columns={columns}
        data={data}
        indexColumn={true}
      />
    </div>
  );
}

export default MainLeagueRanking;