import React from 'react';
import { Link } from 'react-router-dom';
import styles from './FooterComponent.module.css';

type FooterComponentProps = {
  hidden: boolean;
};

const FooterComponent: React.FC<FooterComponentProps> = ({ hidden }) => {

  if (hidden) {
    return null;
}
  return (
    <footer className={styles.footer}>
      <Link to="/">Home</Link>&nbsp;|&nbsp;
      <Link to="/users">Users</Link>&nbsp;|&nbsp; 
      <Link to="/rewards">Rewards</Link>&nbsp;|&nbsp;
      <Link to="/wallet">Wallet</Link>&nbsp;|&nbsp;
      <Link to="/yourwallet">Your Wallet</Link>
    </footer>
  );
};

export default FooterComponent;
