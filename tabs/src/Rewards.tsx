import React from 'react';
import RewardsComponent from './components/RewardsComponent';
const adminKey = process.env.REACT_APP_LNBITS_ADMINKEY as string;

const Rewards: React.FC = () => {
  return (
    <div>
      <RewardsComponent adminKey={adminKey} userId={'2984e3ac627e4fea9fd6dde9c4df83b5'} />
    </div>
  );
};

export default Rewards;