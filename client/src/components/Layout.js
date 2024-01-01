import React from 'react';
import { Text } from '@fluentui/react-components';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <Text variant="xLarge">ZapVibes</Text>
      </header>
      <main>{children}</main>
      <footer>
        <Text variant="medium">© 2022 ZapVibes</Text>
      </footer>
    </div>
  );
};

export default Layout;