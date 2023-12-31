import React, { useState } from 'react';

const Users = () => {
  const [users, setUsers] = useState([
    // Example users
    { name: 'User1', nPub: 'nPub1' },
    { name: 'User2', nPub: 'nPub2' },
  ]);

  return (
    <div>
      <h1>Admin Users</h1>
      {users.map((user, index) => (
        <div key={index}>
          <h2>{user.name}</h2>
          <p>{user.nPub}</p>
        </div>
      ))}
    </div>
  );
};

export default Users;
