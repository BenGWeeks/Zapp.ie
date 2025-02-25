import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// Fluent UI imports
import { Stack } from '@fluentui/react';

// MSAL imports
import { MsalProvider } from '@azure/msal-react';
import { IPublicClientApplication } from '@azure/msal-browser';
import { CustomNavigationClient } from './utils/NavigationClient';
import RequireAuth from './components/RequireAuth';

// Sample app imports
import { PageLayout } from './components/PageLayout';

// Import the pages
import Login from './Login';
import Feed from './Feed';
import Users from './Users';
import './App.css';
import Rewards from './Rewards';
import Wallet from './Wallet';
import Settings from './Settings';

//Importing settings
import { RewardNameProvider } from './components/RewardNameContext';

import AuthStart from './AuthStart';
import AuthEnd from './AuthEnd';



type AppProps = {
  pca: IPublicClientApplication;
};

function App({ pca }: AppProps) {
  return (

    <MsalProvider instance={pca}>
      <RewardNameProvider>
      <PageLayout>
        <Stack horizontalAlign="center">
          <Pages />
        </Stack>
      </PageLayout>
      </RewardNameProvider>

    </MsalProvider>
  );
}


function Pages() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/feed"
        element={
          <RequireAuth>
            <Feed />
          </RequireAuth>
        }
      />
      <Route
        path="/users"
        element={
          <RequireAuth>
            <Users />
          </RequireAuth>
        }
      />
      <Route
        path="/Rewards"
        element={
          <RequireAuth>
            <Rewards />
          </RequireAuth>
        }
      />
      <Route
        path="/Wallet"
        element={
          <RequireAuth>
            <Wallet />
          </RequireAuth>
        }
      />
            <Route
        path="/Settings"
        element={
          <RequireAuth>
            <Settings />
          </RequireAuth>
        }
      />
      
    </Routes>
  );
}

export default App;

