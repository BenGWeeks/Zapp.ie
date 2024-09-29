import {
  graphConfig,
  graphLoginRequest,
  powerPlatformLoginRequest,
} from '../services/authConfig';
import { msalInstance } from '../index';

// Store tokens in localStorage (persists between page reloads)
let graphAccessToken = localStorage.getItem('graphAccessToken');
let graphAccessTokenPromise: Promise<string> | null = null; // To cache the pending token request
let powerPlatformAccessToken = localStorage.getItem('powerPlatformAccessToken');
let powerPlatformAccessTokenPromise: Promise<string> | null = null; // To cache the pending token request

export async function getGraphAccessToken(): Promise<string> {
  console.log('getAccessToken ...');
  if (graphAccessToken) {
    //console.log('Using cached access token: ' + accessToken);
    //return accessToken;
  } else {
    console.log('No cached access token found');
  }

  // If there's already a token request in progress, return the existing promise
  if (graphAccessTokenPromise) {
    console.log('Returning ongoing access token request');
    //return accessTokenPromise;
  }

  // No access token and no request in progress, create a new one
  console.log('No cached access token found, requesting a new one');

  graphAccessTokenPromise = (async (): Promise<string> => {
    try {
      const account = msalInstance.getActiveAccount();
      if (!account) {
        throw Error(
          'No active account! Verify a user has been signed in and setActiveAccount has been called.',
        );
      }

      const response = await msalInstance.acquireTokenSilent({
        ...graphLoginRequest,
        account: account,
      });

      console.log('response:', response);
      return response.accessToken;
    } catch (error) {
      console.error('Error in getAccessToken:', error);
      // Throw an error to ensure the promise doesn't resolve with undefined
      throw new Error('Failed to retrieve access token');
    } finally {
      // Reset the promise to allow future requests
      graphAccessTokenPromise = null;
    }
  })();

  // Return the token promise
  return graphAccessTokenPromise;
}

// This function is specific for Power Platform, ensure it's using the correct token and scope
export async function getPowerPlatformAccessToken(): Promise<string> {
  if (powerPlatformAccessToken) {
    return powerPlatformAccessToken;
  } else {
    const account = msalInstance.getActiveAccount();
    if (!account) {
      throw new Error('No active account! Sign in required.');
    }

    try {
      const response = await msalInstance.acquireTokenSilent({
        ...powerPlatformLoginRequest, // Make sure this is for Power Platform only
        account: account,
      });

      powerPlatformAccessToken = response.accessToken;
      localStorage.setItem(
        'powerPlatformAccessToken',
        powerPlatformAccessToken,
      );
      return powerPlatformAccessToken;
    } catch (error) {
      console.error('Failed to acquire Power Platform token silently:', error);

      // Fallback to interactive login
      const interactiveResponse = await msalInstance.acquireTokenPopup({
        ...powerPlatformLoginRequest, // Ensure this is specific to Power Platform
      });

      powerPlatformAccessToken = interactiveResponse.accessToken;
      localStorage.setItem(
        'powerPlatformAccessToken',
        powerPlatformAccessToken,
      );
      return powerPlatformAccessToken;
    }
  }
}

const getApplications = async (): Promise<Copilot[] | null> => {
  console.log('getApplications ...');
  const accessToken = await getGraphAccessToken();

  console.log('accessToken:', accessToken);

  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;
  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };

  const response = await fetch(graphConfig.graphApplicationsEndpoint, options);

  if (!response.ok) {
    throw new Error(`Failed to fetch applications: ${response.statusText}`);
  }

  const data = await response.json();

  // Assuming the API returns an array of copilots in the 'value' property
  if (!Array.isArray(data.value)) {
    throw new Error('Expected an array of applications');
  }

  console.log('Applications:', data);

  return data.value;
};

const getCopilots = async (): Promise<Copilot[] | null> => {
  console.log('getCopilots ...');

  // Get Power Platform access token using Power Platform login request
  const accessToken = await getPowerPlatformAccessToken();
  console.log('Power Platform access token:', accessToken);

  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;
  headers.append('Authorization', bearer);

  const options = {
    method: 'GET',
    headers: headers,
  };

  // Use the Power Platform API endpoint with the correct version
  const apiUrl = `https://api.powerplatform.com/environments/{environment-id}/bots?api-version=2023-06-01`;
  const response = await fetch(apiUrl, options);

  if (!response.ok) {
    throw new Error(`Failed to fetch copilots: ${response.statusText}`);
  }

  const data = await response.json();

  if (!Array.isArray(data.value)) {
    throw new Error('Expected an array of copilots');
  }

  console.log('Copilots:', data);

  return data.value;
};

export { getApplications, getCopilots };
