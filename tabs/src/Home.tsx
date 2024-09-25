import React, { useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { callMsGraph, ProfileData } from "./components/UserDetails";
import { Stack, PrimaryButton, Image, Text } from '@fluentui/react';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { IRawStyle } from '@fluentui/react';
import SignInSignOutButton from './components/SignInSignOutButton';
import { useNavigate } from 'react-router-dom';
import './styles/Home.css';
import FeedComponent from './components/FeedComponent';
import ZapActivityChartComponent from './components/ZapActivityChartComponent';
import Leaderboard from './components/Leaderboard';
import styles from './components/Leaderboard.module.css';

const centeredImageStyle: IRawStyle = {
  display: 'block',
  margin: '0 auto',
  maxHeight: 'auto', // Maintain aspect ratio
  top: "100px",
};

export function Home() {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const navigate = useNavigate();
  const inKey = 'a77d1194b4f348b1a61e4e2938b5762f'; // TODO: Hardcoded to Ben's Allowance wallet for now.
  const [timestamp] = useState(() => {
    return Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 365 * (8.5 / 12); // Last 8.5 months
  });

  useEffect(() => {
    if (accounts.length > 0) {
      const request = {
        scopes: ["User.Read"],
        account: accounts[0]
      };

      instance.acquireTokenSilent(request).then(response => {
        callMsGraph(response.accessToken).then(response => {
          setGraphData(response);
          if (response.id) {
            const User = response; console.log(User);
          }
        });
      }).catch(error => {
        if (error.errorCode === 'user_cancelled') {
          console.log('User cancelled the flow.');
          // Navigate back to the previous page
          navigate(-1);
        } else {
          instance.acquireTokenPopup(request).then(response => {
            callMsGraph(response.accessToken).then(response => {
              setGraphData(response);
              if (response.id) {
                const User = response;
              }
            });
          }).catch(error => {
            console.error('Authentication error:', error);
          });
        }
      });
    }
  }, [accounts, instance, navigate]);

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
            <div>
      <ZapActivityChartComponent lnKey={inKey} timestamp={timestamp} />
      <br />
      <FeedComponent />
    </div>
          </Stack>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
        <Text styles={{ root: { color: 'white', fontSize: '4vw', fontWeight: 'bold' } }}>
            Zapp.ie
          </Text>
          <Text styles={{ root: { textAlign: 'center', display: 'block', marginTop: '100px', color: 'white', fontSize: '1vw' } }}>
            <p>Boost collaboration, reward achievements, incentivize improvement, and drive real value with Zaps.</p>
            <p>To get started, please log in to access your dashboard, manage your rewards, and start recognizing your teammates' efforts.</p>
            <p><b>Log in now to power up your workplace!</b></p>
          </Text>
          <SignInSignOutButton />
        </UnauthenticatedTemplate>
      </div>
    </div>
  );
}

export default Home;
