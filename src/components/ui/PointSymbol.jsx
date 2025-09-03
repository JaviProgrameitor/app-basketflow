
import React from 'react';
import { colorQuarter } from '../../data/match.js';

const PointSymbol = ({point_value, quarter}) => {

  return (
    <React.Fragment>
      {point_value === 3 && (
        // Círculo
        <div className={`size-5/6 absolute rounded-full border-2 ${colorQuarter[quarter]?.border}`} />
      )}
      {point_value === 2 && (
        // Diagonal usando SVG
        <svg className="w-8 h-8 absolute" viewBox="0 0 32 32">
          <line x1="0" y1="32" x2="32" y2="0" stroke={`${colorQuarter[quarter]?.hex}`} strokeWidth="2" />
        </svg>
      )}
      {point_value === 1 && (
        // Punto
        <div className={`w-2 h-2 absolute rounded-full ${colorQuarter[quarter]?.bg}`} />
      )}
    </React.Fragment>
  )
}

export default PointSymbol;