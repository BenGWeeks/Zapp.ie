import { Routes, Route, useNavigate } from "react-router-dom";
// Fluent UI imports
import { ThemeProvider } from '@fluentui/react';
import { theme } from './styles/Theme'; // Adjust the import path as necessary

// Material-UI imports
import Grid from "@mui/material/Grid";

// MSAL imports
import { MsalProvider } from "@azure/msal-react";
import { IPublicClientApplication } from "@azure/msal-browser";
import { CustomNavigationClient } from "./utils/NavigationClient";

// Sample app imports
import { PageLayout } from "./components/PageLayout";
import { Home } from "./Home";


type AppProps = {
    pca: IPublicClientApplication;
};

function App({ pca }: AppProps) {
    // The next 3 lines are optional. This is how you configure MSAL to take advantage of the router's navigate functions when MSAL redirects between pages in your app
    const navigate = useNavigate();
    const navigationClient = new CustomNavigationClient(navigate);
    pca.setNavigationClient(navigationClient);

    return (
        <MsalProvider instance={pca}>
            <ThemeProvider theme={theme}>
                <PageLayout>
                    <Grid container justifyContent="center">
                        <Pages />
                    </Grid>
                </PageLayout>
            </ThemeProvider>
        </MsalProvider>
    );
}

function Pages() {
    return (
        <Routes>
            <Route path="/test" element={<FeedComponent />} />
            <Route path="/" element={<Home />} />
        </Routes>
    );
}

export default App;