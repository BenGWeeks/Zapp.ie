import React from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from './NavBar';

type Props = {
  children?: React.ReactNode;
};

export const PageLayout: React.FC<Props> = ({ children }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const hideNavBar = queryParams.get('hideNavBar') === 'true';

  return <>{children}</>;
};
