import { Text } from '@fluentui/react';
import { MsalAuthenticationResult } from "@azure/msal-react";

export const ErrorComponent: React.FC<MsalAuthenticationResult> = ({ error }) => {
    return <Text variant="large">An Error Occurred: {error ? error.errorCode : "unknown error"}</Text>;
};