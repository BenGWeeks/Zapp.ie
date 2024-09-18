import { Configuration, PopupRequest } from "@azure/msal-browser";
const AADclientid = process.env.REACT_APP_AAD_CLIENT_ID as string;

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
    auth: {
        clientId: AADclientid,
        authority: "https://login.microsoftonline.com/19ced85d-73f5-4193-8797-9fdce478db64",
        redirectUri: "/",
        postLogoutRedirectUri: "/"
    },
    system: {
        allowNativeBroker: false // Disables WAM Broker
    }
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: PopupRequest = {
    scopes: ["User.Read"]
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};