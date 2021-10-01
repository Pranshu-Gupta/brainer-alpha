import React from 'react';

const Rank = ({ name, entries }) => {
  return (
    <div className='tc main'>
      <div className='white f3 b'>{`${name}, your current Rank is: `}</div>
      <div className='white f1 b'>{entries}</div>
    </div>
  );
};

export default Rank;
