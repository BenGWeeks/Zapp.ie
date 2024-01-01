import React, { useState, useEffect } from 'react';
import { DetailsList } from '@fluentui/react';

const Reports = () => {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    // Fetch the top 10 users by Zaps received
    // This is a placeholder, replace with actual API call
    fetch('/api/topUsers')
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
      <DetailsList
        items={topUsers}
        columns={columns}
        setKey="set"
        layoutMode="fixedColumns"
        selectionPreservedOnEmptyClick={true}
        ariaLabelForSelectionColumn="Toggle selection"
        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
      />
    </div>
  );
};

export default Reports;
