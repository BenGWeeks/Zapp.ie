import React, { useState } from 'react';
import { Pivot, PivotItem } from '@fluentui/react';

const Bounties = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Pivot selectedKey={value} onLinkClick={handleChange}>
        <PivotItem headerText="All active bounties" />
        <PivotItem headerText="History of awards" />
      </Pivot>
      {value === 0 && <h1>All active bounties</h1>}
      {value === 1 && <h1>History of awards</h1>}
    </div>
  );
};

export default Bounties;
