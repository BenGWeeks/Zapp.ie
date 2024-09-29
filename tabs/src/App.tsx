import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
// Fluent UI imports
import { ThemeProvider, Stack } from '@fluentui/react';
import React from 'react';

// MSAL imports
import { MsalProvider } from '@azure/msal-react';
import { IPublicClientApplication } from '@azure/msal-browser';
import { CustomNavigationClient } from './utils/NavigationClient';

// Sample app imports
import { PageLayout } from './components/PageLayout';

// Import the pages
import Login from './Login';
import Feed from './Feed';
import Automations from './Automations';
import Users from './Users';
import './App.css';
import Rewards from './Rewards';
import Wallet from './Wallet';

type AppProps = {
  pca: IPublicClientApplication;
};

function App({ pca }: AppProps) {
  // The next 3 lines are optional. This is how you configure MSAL to take advantage of the router's navigate functions when MSAL redirects between pages in your app
  const navigate = useNavigate();
  const navigationClient = new CustomNavigationClient(navigate);
  pca.setNavigationClient(navigationClient);

  return (
    <MsalProvider instance={pca}>
      <PageLayout>
        <Stack horizontalAlign="center">
          <Pages />
        </Stack>
      </PageLayout>
    </MsalProvider>
  );
}

function Pages() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/feed" element={<Feed />} />
      <Route path="/automations" element={<Automations />} />
      <Route path="/users" element={<Users />} />
      <Route path="/Rewards" element={<Rewards />} />
      <Route path="/Wallet" element={<Wallet />} />
    </Routes>
  );
}

export default App;
