import { useMsal } from '@azure/msal-react';
import { DefaultButton } from '@fluentui/react';
import * as microsoftTeams from '@microsoft/teams-js';
import { loginRequest } from '../services/authConfig';

export const SignInButton = () => {
  const { instance } = useMsal();

  const handleLogin = async () => {
    const redirectUrl = window.location.href;

    try {
      // Initialize Teams SDK and check context
      await microsoftTeams.app.initialize();
      const context = await microsoftTeams.app.getContext();

      if (context.app.host.clientType === 'desktop') {
        console.log('Running inside Teams');

        // Use the new `authentication.authenticate` method
        try {
          const authToken = await microsoftTeams.authentication.authenticate({
            url: `${window.location.origin}/auth-start?action=login&redirectUrl=${encodeURIComponent(redirectUrl)}`,
            width: 600,
            height: 535,
          });

          console.log('Teams Auth Token:', authToken);

          const accounts = instance.getAllAccounts();
          if (accounts.length === 0) {
            console.warn('No accounts found for silent token acquisition');
            return;
          }

          const msalResponse = await instance.acquireTokenSilent({
            scopes: ['User.Read'],
            account: accounts[0],
          });

          console.log('MSAL Token Response:', msalResponse);
          // Handle successful authentication
        } catch (error) {
          console.error('Error during Teams authentication:', error);

          // Fallback to interactive login
          try {
            const msalResponse = await instance.loginPopup(loginRequest);
            console.log('MSAL Token Response (interactive):', msalResponse);
          } catch (interactiveError) {
            console.error('Error during interactive login:', interactiveError);
          }
        }
      } else {
        console.log('Running in a web browser');

        // Handle web browser authentication
        try {
          const msalResponse = await instance.loginPopup({
            scopes: ['User.Read'],
            prompt: 'select_account',
          });
          
          // Handle successful authentication
        } catch (error) {
          console.error('Error during loginPopup:', error);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      console.log('Running in a web browser');
      // Handle web browser authentication
      try {
        const msalResponse = await instance.loginPopup({
          scopes: ['User.Read'],
          prompt: 'select_account',
        });

        console.log('MSAL Token Response:', msalResponse);
        // Handle successful authentication
      } catch (error) {
        console.error('Error during loginPopup:', error);
      }
    }
  };

  return (
    <div>
      <DefaultButton
        text="Sign In"
        onClick={handleLogin}
        styles={{
          root: {
            color: 'black',
            width: 'auto',
            lineHeight: '20px',
            fontWeight: 600,
          },
        }}
      />
    </div>
  );
};