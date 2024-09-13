import React from 'react';
import { Link } from 'react-router-dom';
import styles from './FooterComponent.module.css';

const FooterComponent: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <Link to="/">Home</Link> | <Link to="/users">Users</Link>
    </footer>
  );
};

export default FooterComponent;
