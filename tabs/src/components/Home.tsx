/// <reference path="../types/global.d.ts" />

import React, { useState, useEffect } from 'react';
import { useMsal } from "@azure/msal-react";
import { callMsGraph, ProfileData } from "../graph";
import { Stack, PrimaryButton, Image, Text } from '@fluentui/react';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from "@azure/msal-react";
import { IRawStyle } from '@fluentui/react';
import SignInSignOutButton from '../ui-components/SignInSignOutButton';

const backgroundImageStyle: IRawStyle = {
  backgroundImage: 'url(HomeImage.png)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
};

const centeredImageStyle: IRawStyle = {
  maxHeight: 'auto', // Maintain aspect ratio
  top: "100px",
};

export function Home() {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);

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
    <Stack styles={{ root: backgroundImageStyle }}>
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
        <Text styles={{ root: { color: 'white', fontSize: '4vw', fontWeight: 'bold' } }}>
          Zapp.ie
        </Text>
        <Text styles={{ root: { textAlign: 'center', display: 'block', marginTop: '100px', color: 'white', fontSize: '1vw' } }}>
          <p>Seamless Microsoft Teams app designed to boost team morale by allowing users to send and receive Sats (bitcoins) as a form of gratitude.</p>
          <p>Whether recognizing colleagues for outstanding work or rewarding customers for completing tasks, Zapp.ie integrates effortlessly into your workflow, turning appreciation into tangible rewards.</p>
          <p>Empower your team with the ability to zap, earn, and convert Sats into discounts or project perks</p>
        </Text><SignInSignOutButton />
      </UnauthenticatedTemplate>
    </Stack>
  );
}