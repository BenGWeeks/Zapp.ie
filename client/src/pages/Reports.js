import React, { useState, useEffect } from 'react';
import './Reports.css';
import UserOnBoard from '../components/UserOnBoard';
import { DetailsList } from '@fluentui/react';

const Reports = () => {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/topUsers`)
      .then(response => response.json())
      .then(data => setTopUsers(data));
  }, []);

  const columns = [
    { key: 'position', name: 'Position', fieldName: 'position', minWidth: 50, maxWidth: 200, isResizable: true },
    { key: 'name', name: 'Name', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true },
    { key: 'zaps', name: 'Zaps', fieldName: 'zaps', minWidth: 100, maxWidth: 200, isResizable: true },
  ];

  return (
    <div>
      <h1>Reports</h1>
      <div className="users-list">
        {topUsers.map((user, index) => (
          <UserOnBoard
            key={index}
            className="user-on-board-instance"
            frameClassName="frame-3"
            frameClassNameOverride="frame-5"
            groupClassName="design-component-instance-node"
            groupClassNameOverride="frame-4"
            icon={
              <Icon
                className="icon-instance-node"
                color="url(#paint0_linear_344_1932)"
                stroke="url(#paint1_linear_344_1932)"
              />
            }
            property1="default"
            rankProperty1="regular"
            rankPropertyLeaderClassName="frame-6"
            text={user.name}
            text1={user.zaps}
          />
        ))}
      </div>
    </div>
  );
};

export default Reports;
