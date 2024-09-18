import React from 'react';
import RewardsComponent from './components/RewardsComponent';
const adminKey = process.env.REACT_APP_LNBITS_ADMINKEY as string;

const Rewards: React.FC = () => {
  return (
    <div>
      <RewardsComponent adminKey={adminKey} />
    </div>
  );
};

export default Rewards;