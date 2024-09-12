import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IRawStyle, Stack, Image, PrimaryButton, Text } from '@fluentui/react';
import { AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react';
import { theme } from '../styles/Theme'; // Adjust the import path as necessary
import SignInSignOutButton from '../ui-components/SignInSignOutButton'; // Adjust the import path as necessary

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
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/profile");
  };

  return (
    <Stack styles={{ root: backgroundImageStyle }}>
<Image src="eirevo.png" styles={{ root: centeredImageStyle }} alt="Eirevo" width="10%" />
<AuthenticatedTemplate>
  <Stack tokens={{ childrenGap: 10 }} styles={{ root: { marginTop: '100px' } }}>
    <PrimaryButton onClick={handleButtonClick}>
      Request Profile Information
    </PrimaryButton>
  </Stack>
</AuthenticatedTemplate>

<UnauthenticatedTemplate>
  <Text styles={{ root: { color: theme.palette.neutralPrimary, fontSize: '4vw', fontWeight: 'bold' } }}>
    Zapp.ie
  </Text>
  <Text styles={{ root: { textAlign: 'center', display: 'block', marginTop: '100px', color: theme.palette.neutralPrimary, fontSize: '1vw' } }}>
    <p>Seamless Microsoft Teams app designed to boost team morale by allowing users to send and receive Sats (bitcoins) as a form of gratitude.</p>
    <p>Whether recognizing colleagues for outstanding work or rewarding customers for completing tasks, Zapp.ie integrates effortlessly into your workflow, turning appreciation into tangible rewards.</p>
    <p>Empower your team with the ability to zap, earn, and convert Sats into discounts or project perks</p>
  </Text>
  <SignInSignOutButton />
</UnauthenticatedTemplate>
    </Stack>
  );
}