import React, { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { callMsGraph, ProfileData } from './components/UserDetails';
import { Stack, PrimaryButton, Image, Text } from '@fluentui/react';
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from '@azure/msal-react';
import { IRawStyle } from '@fluentui/react';
import SignInSignOutButton from './components/SignInSignOutButton';
import styles from './styles/Home.module.css';

const centeredImageStyle: IRawStyle = {
  display: 'block',
  margin: '0 auto',
  maxHeight: 'auto', // Maintain aspect ratio
  top: '100px',
};

export function Home() {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const inKey = 'ca04dc4dbc114b298f6d121b1d4ffc8e'; // Hardcoded to my wallet for now.
  const [timestamp] = useState(() => {
    return Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 365 * (9 / 12); // Last 9 months
  });

  useEffect(() => {
    if (accounts.length > 0) {
      const request = {
        scopes: ['User.Read'],
        account: accounts[0],
      };

      instance
        .acquireTokenSilent(request)
        .then(response => {
          callMsGraph(response.accessToken).then(response => {
            setGraphData(response);
            if (response.id) {
              const User = response;
              console.log(User);
            }
          });
        })
        .catch(error => {
          instance.acquireTokenPopup(request).then(response => {
            callMsGraph(response.accessToken).then(response => {
              setGraphData(response);
              if (response.id) {
                const User = response;
              }
            });
          });
        });
    }
  }, [accounts, instance]);

  return (
    <div className={styles.container}>
      <div className={styles.bg}>
        <img className={styles.imageIcon} alt="" src="CircuitBackground.png" />
        <div className={styles.shadow} />
      </div>
      <div className={styles.content}>
        <AuthenticatedTemplate>
          <img className={styles.headerLogoIcon} alt="" src="eirevo.png" />
          <Stack
            tokens={{ childrenGap: 10 }}
            styles={{ root: { marginTop: '100px' } }}
          >
            {graphData && <ProfileData graphData={graphData} />}
          </Stack>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <img className={styles.headerLogoIcon} alt="" src="eirevo.png" />
          <div className={styles.description}>
            <b className={styles.zappie}>Zapp.ie</b>
            <div className={styles.seamlessMicrosoftTeamsContainer}>
              <p className={styles.seamlessMicrosoftTeams}>
                Boost collaboration, reward achievements, incentivize
                improvement, and drive real value with Zaps.
              </p>
              <p className={styles.seamlessMicrosoftTeams}>&nbsp;</p>
              <p className={styles.seamlessMicrosoftTeams}>
                To get started, please log in to access your dashboard, manage
                your rewards, and start recognizing your teammates' efforts.
              </p>
              <p className={styles.seamlessMicrosoftTeams}>&nbsp;</p>
              <p className={styles.seamlessMicrosoftTeams}>
                <b>Log in now to power up your workplace!</b>
              </p>
            </div>
          </div>
          <div className={styles.buttons}>
            <SignInSignOutButton />
          </div>
        </UnauthenticatedTemplate>
      </div>
    </div>
    
  );
}

export default Home;
