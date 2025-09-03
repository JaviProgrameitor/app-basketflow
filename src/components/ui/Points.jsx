
import React from 'react';
import { colorQuarter } from '../../data/match.js';
import PointSymbol from './PointSymbol.jsx';

const Points = ({poinstsMemo = {}, i, leftPosition = false, openModal = () => {}, lastFourMinutes, currentQuarter}) => {

  const handleManagePoint = () => {
    // if(poinstsMemo[i + 1] && !lastFourMinutes) {
    //   openModal('validatePassword', {...poinstsMemo[i + 1], modalTitle: 'Eliminar Canasta'})
    // }

    //point exists and is in the last four minutes => do nothing
    if (poinstsMemo.hasOwnProperty('period') && lastFourMinutes && currentQuarter === 4) return;
    openModal('validatePassword', { ...poinstsMemo, modalTitle: 'Eliminar Canasta' });
  }

  return (
    <div
      onClick={handleManagePoint}
      className={`${poinstsMemo.hasOwnProperty('period') && 'cursor-pointer hover:bg-gray-200'} grid grid-cols-2 w-1/2 h-7 ${leftPosition && 'border-r'} border-black sm:text-xs lg:text-sm`}
    >
      <div className={`${leftPosition && 'border-r'} border-b border-black font-medium h-full flex items-center justify-center ${colorQuarter[poinstsMemo.period]?.text}`}>
        {poinstsMemo.jersey_number || poinstsMemo.number || ''}
      </div>
      <div className={`border-b border-black h-full flex items-center justify-center relative  overflow-hidden ${!leftPosition && 'order-first border-r'}`}>
        {i + 1}
        {
          poinstsMemo.hasOwnProperty('period') && (
            <PointSymbol point_value={poinstsMemo.point_value} quarter={poinstsMemo.period} />
          )
        }
      </div>
    </div>
  )
}

export default Points;