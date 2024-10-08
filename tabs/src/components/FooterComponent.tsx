import React from 'react';
import { Link } from 'react-router-dom';
import styles from './FooterComponent.module.css';
import SignInSignOutButton from './SignInSignOutButton';

type FooterComponentProps = {
  hidden: boolean;
};

const FooterComponent: React.FC<FooterComponentProps> = ({ hidden }) => {

  if (hidden) {
    return null;
}
  return (
    <footer className={styles.footer}>
      <Link to="/feed">Feed</Link>&nbsp;|&nbsp;
      <Link to="/reports">Reports</Link>&nbsp;|&nbsp; 
   
      <SignInSignOutButton />
    </footer>
    
  );
};

export default FooterComponent;
