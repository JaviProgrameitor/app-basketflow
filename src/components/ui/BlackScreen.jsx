
import React from 'react';

const BlackScreen = ({children}) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      {children}
    </div>
  );
}

export default BlackScreen;