import React, { memo, useMemo } from 'react';
import Points from './Points.jsx';
import { calculatePoints } from '../../helpers/match.js';

// Función para comparar arrays de objetos superficialmente
function arePointsEqual(prev, next) {
  if (prev.length !== next.length) return false;
  for (let i = 0; i < prev.length; i++) {
    const a = prev[i], b = next[i];
    if (
      (!a && b) || (a && !b) // uno es undefined/null, el otro no
      || (a && b && (a.point_value !== b.point_value))
    ) return false;
  }
  return true;
}

const ProgressiveScore = memo(function ProgressiveScore({ pointsHome = [], pointsAway = [], openModal = () => {} , lastFourMinutes, currentQuarter }) {
  const poinstsHomeMemo = useMemo(() => calculatePoints(pointsHome), [pointsHome]);

  const poinstsAwayMemo = useMemo(() => calculatePoints(pointsAway), [pointsAway]);

  const columsMemo = useMemo(() => {
    return Math.max(
      poinstsHomeMemo.accumulated,
      poinstsAwayMemo.accumulated,
      35
    )

  }, [pointsAway, pointsHome]);

  return (
    <div className="col-start-5 border-black border-x flex flex-wrap h-[calc(100vh-70px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {
        Array.from({ length: columsMemo }).map((_, i) => 
          <React.Fragment key={i}>
            <Points
              poinstsMemo={poinstsHomeMemo.pointsTotal[i + 1] ?? {}}
              i={i}
              openModal={openModal}
              leftPosition={true}
              lastFourMinutes={lastFourMinutes}
              currentQuarter={currentQuarter}
            />
            <Points
              poinstsMemo={poinstsAwayMemo.pointsTotal[i + 1] ?? {}}
              i={i}
              openModal={openModal}
              lastFourMinutes={lastFourMinutes}
              currentQuarter={currentQuarter}
            />
          </React.Fragment>
        )
      }
    </div>
  );
}, (prevProps, nextProps) =>
  arePointsEqual(prevProps.pointsHome, nextProps.pointsHome) &&
  arePointsEqual(prevProps.pointsAway, nextProps.pointsAway) &&
  prevProps.lastFourMinutes === nextProps.lastFourMinutes &&
  prevProps.currentQuarter === nextProps.currentQuarter
);

export default ProgressiveScore;