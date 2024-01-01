import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h1>Admin Home</h1>
      <Link to="/admin/users">Users</Link>
      <Link to="/admin/lightningwallet">Wallet</Link>
    </div>
  );
};

export default Home;
