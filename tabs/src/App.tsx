import {  BrowserRouter as Router,Routes, Route, useNavigate } from 'react-router-dom';
import React from 'react';

// Fluent UI imports
import { ThemeProvider } from '@fluentui/react';
import { theme } from './styles/Theme'; // Adjust the import path as necessary

// Material-UI imports
import Grid from '@mui/material/Grid';

// MSAL imports
import { MsalProvider } from '@azure/msal-react';
import { IPublicClientApplication } from '@azure/msal-browser';
import { CustomNavigationClient } from './utils/NavigationClient';

// Sample app imports
import { PageLayout } from './components/PageLayout';

// Import the pages
import Home from './Home';
import './App.css';
import Rewards from './Rewards';
import Wallet from './Wallet';
import YourWallet from './YourWallet';

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
      <ThemeProvider theme={theme}>
        <PageLayout>
          <Grid container justifyContent="center">
            <Pages />
          </Grid>
        </PageLayout>
      </ThemeProvider>
    </MsalProvider>

  );
}

function Pages() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<Users />} />
      <Route path="/Rewards" element={<Rewards />} />
      <Route path="/Wallet" element={<Wallet />} />
      <Route path="/YourWallet" element={<YourWallet />} />
    </Routes>
  );
}

export default App;
