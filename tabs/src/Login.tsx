import React, { useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { callMsGraph, ProfileData } from "./components/UserDetails";
import { Stack, PrimaryButton, Image, Text } from '@fluentui/react';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { IRawStyle } from '@fluentui/react';
import SignInSignOutButton from './components/SignInSignOutButton';
import { useNavigate } from 'react-router-dom';
import './styles/Home.css';

const centeredImageStyle: IRawStyle = {
  display: 'block',
  margin: '0 auto',
  maxHeight: 'auto', // Maintain aspect ratio
  top: "100px",
};

export function Login() {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (accounts.length > 0) {
      // Redirect authenticated users to /leaderboard
      navigate('/feed');
    }
  }, [accounts, navigate]);

  return (
    <div className="home-container">
      <div className="overlay"></div>
      <div className="content">
        <Image src="eirevo.png" styles={{ root: centeredImageStyle }} alt="Eirevo" width="5%" />
        <AuthenticatedTemplate>
          <Text styles={{ root: { color: 'white', fontSize: '4vw', fontWeight: 'bold' } }}>
            Zapp.ie
          </Text>
          <Stack tokens={{ childrenGap: 10 }} styles={{ root: { marginTop: '100px' } }}>
            {graphData && <ProfileData graphData={graphData} />}
          </Stack>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <Text styles={{ root: { color: '#F2A900', fontSize: '4vw', fontWeight: 'bold',lineHeight: '2' } }}>
            Zapp.ie
          </Text>
          <Text styles={{ root: { textAlign: 'center', marginTop: '100px', color: 'white', fontSize: '1vw', fontfamily: 'Inter', display: 'block'} }}>
            <p>Boost collaboration, reward achievements, incentivize improvement, and drive real value with Zaps.</p>
            <p>To get started, please log in to access your dashboard, manage your rewards, and start recognizing your teammates' efforts.</p>
            <br></br>
          </Text>
          <SignInSignOutButton />
        </UnauthenticatedTemplate>
      </div>
    </div>
  );
}

export default Login;