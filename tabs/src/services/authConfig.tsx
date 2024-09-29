import { Configuration, PopupRequest } from '@azure/msal-browser';

const aadClientId = process.env.REACT_APP_AAD_CLIENT_ID as string;
const TenantId = process.env.REACT_APP_TENANT_ID as string;

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
  auth: {
    clientId: aadClientId,
    authority: `https://login.microsoftonline.com/${TenantId}`,
    redirectUri: '/',
    postLogoutRedirectUri: '/',
  },
  system: {
    allowNativeBroker: false, // Disables WAM Broker
  },
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const graphLoginRequest: PopupRequest = {
  scopes: [
    'User.Read', // Read current user profile
    'User.ReadBasic.All', // Read basic profile of other users
    'Directory.Read.All', // Read directory data
    'AuditLog.Read.All', // Read audit logs
    'AppCatalog.Read.All', // Read installed apps in the catalog
  ],
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
  graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me',
  graphInstallAppsEndpoint: 'https://graph.microsoft.com/v1.0/installedApps',
  graphApplicationsEndpoint: 'https://graph.microsoft.com/v1.0/applications',
};

export const powerPlatformLoginRequest: PopupRequest = {
  scopes: [
    'user_impersonation', // Power Platform API scopes
  ],
};
