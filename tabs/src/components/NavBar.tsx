import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Stack, Link, Text, useTheme } from '@fluentui/react';
import WelcomeName from './WelcomeName';
import SignInSignOutButton from './SignInSignOutButton';

type NavBarProps = {
    hidden: boolean;
};

const NavBar: React.FC<NavBarProps> = ({ hidden }) => {
    const theme = useTheme();

    if (hidden) {
        return null;
    }

    return (
        <Stack
            horizontal
            horizontalAlign="start"
            verticalAlign="center"
            tokens={{ childrenGap: 20 }}
            styles={{
                root: {
                    padding: '0 16px',
                    backgroundColor: theme.palette.themePrimary,
                },
            }}
        >
            <Text variant="xLarge" styles={{ root: { color: theme.palette.white , fontSize: '1vw'} }}>
                <Link
                    as={RouterLink}
                    to="/"
                    styles={{ root: { color: theme.palette.white, textDecoration: 'none' } }}
                >
                    Zapp.ie
                </Link>
            </Text>
            <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 20 }}>
                <Link as={RouterLink} to="/automation" styles={{ root: { color: theme.palette.white, textDecoration: 'none' } }}>
                    Automation
                </Link>
                <Link as={RouterLink} to="/rewards" styles={{ root: { color: theme.palette.white, textDecoration: 'none' } }}>
                    Rewards
                </Link>
                <Link as={RouterLink} to="/bounties" styles={{ root: { color: theme.palette.white, textDecoration: 'none' } }}>
                    Bounties
                </Link>
                <Link as={RouterLink} to="/raisers" styles={{ root: { color: theme.palette.white, textDecoration: 'none' } }}>
                    Raisers
                </Link>
                <Link as={RouterLink} to="/users" styles={{ root: { color: theme.palette.white, textDecoration: 'none' } }}>
                    Users
                </Link>
                <Link as={RouterLink} to="/wallet" styles={{ root: { color: theme.palette.white, textDecoration: 'none' } }}>
                    Wallet
                </Link>
                <Link as={RouterLink} to="/projects" styles={{ root: { color: theme.palette.white, textDecoration: 'none' } }}>
                    Projects
                </Link>
                <WelcomeName />
         
            </Stack>
        </Stack>
    );
};

export default NavBar;