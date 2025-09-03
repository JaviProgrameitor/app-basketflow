
import React, { Fragment } from 'react';

const ParticipationSymbol = ({ participation }) => {
  return (
    <Fragment>
      {
        participation == 'starter' && (
          <Fragment>
            <div className={`size-full absolute top-0 left-0 rounded-full border-2 border-black`} />
            <span className='font-medium'>X</span>
          </Fragment>
        )
      }

      {
        participation == 'substitute' && (
          <span className='font-medium'>X</span>
        )
      }

      {
        participation == 'did_not_play' && (
          <span></span>
        )
      }
    </Fragment>
  )
}

export default ParticipationSymbol;