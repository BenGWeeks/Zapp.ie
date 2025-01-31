import { useMsal } from '@azure/msal-react';
import { ContextualMenu, IContextualMenuProps } from '@fluentui/react';
 
export const SignOutButton = () => {
  const { instance } = useMsal();
 
  const [isHovered, setIsHovered] = useState(false); // State to track hover
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
 
  const handleLogout = (logoutType: string) => {
    setAnchorEl(null);
 
    if (logoutType === 'popup') {
      instance.logoutPopup({
        mainWindowRedirectUri: '/',
      });
    } else if (logoutType === 'redirect') {
      instance.logoutRedirect();
    }
  };
 
 
    const menuProps: IContextualMenuProps = {
        items: [
            {
                key: 'logoutPopup',
                text: 'Logout using Popup',
                onClick: () => handleLogout("popup")
            },
            {
                key: 'logoutRedirect',
                text: 'Logout using Redirect',
                onClick: () => handleLogout("redirect")
            }
        ],
        onDismiss: () => setAnchorEl(null),
        target: anchorEl,
        directionalHint: 4, // topRightEdge
        isBeakVisible: true,
    };
  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        handleLogout();
      }}
      style={{
        textDecoration: 'none',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        (e.target as HTMLElement).style.textDecoration = 'underline';
      }}
      onMouseLeave={e => {
        (e.target as HTMLElement).style.textDecoration = 'none';
      }}
      title="Sign Out"
      aria-label="Sign Out"
    >
      Sign Out
    </a>
  );
};