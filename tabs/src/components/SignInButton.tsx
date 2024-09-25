import { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { DefaultButton, ContextualMenu, IContextualMenuProps } from '@fluentui/react';
import { loginRequest } from "../services/authConfig";

export const SignInButton = () => {
    const { instance } = useMsal();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleLogin = (loginType: string) => {
        setAnchorEl(null);

        if (loginType === "popup") {
            instance.loginPopup(loginRequest);
        } else if (loginType === "redirect") {
            instance.loginRedirect(loginRequest);
        }
    };

    const menuProps: IContextualMenuProps = {
        items: [
            {
                key: 'popup',
                text: 'Login with Popup',
                onClick: () => handleLogin('popup'),
            },
            {
                key: 'redirect',
                text: 'Login with Redirect',
                onClick: () => handleLogin('redirect'),
            },
        ],
        directionalHintFixed: true,
        target: anchorEl,
        onDismiss: () => setAnchorEl(null),
    };

    return (
        <div>
            <DefaultButton 
                text="Log in now to power up your workplace!"
                onClick={() => handleLogin("popup")}
                styles={{ root: { color: 'black', width:'auto' } }}
            />
            {open && <ContextualMenu {...menuProps} />}
        </div>
    );
};