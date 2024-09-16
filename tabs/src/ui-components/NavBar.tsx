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
            horizontalAlign="space-between"
            verticalAlign="center"
            styles={{
                root: {
                    padding: '0 16px',
                    backgroundColor: theme.palette.themePrimary,
                },
            }}
        >
            <Text variant="xLarge" styles={{ root: { color: theme.palette.white } }}>
                <Link
                    as={RouterLink}
                    to="/"
                    styles={{ root: { color: theme.palette.white, textDecoration: 'none' } }}
                >
                    Zapp.ie
                </Link>
            </Text>
            <Stack horizontal verticalAlign="center">
                <WelcomeName />
                <SignInSignOutButton />
            </Stack>
        </Stack>
    );
};

export default NavBar;