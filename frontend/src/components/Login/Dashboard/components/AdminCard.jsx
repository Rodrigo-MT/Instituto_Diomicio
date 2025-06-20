import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../DashboardAdmin.module.css';

const AdminCard = ({ title, description, icon, path }) => {
  return (
    <Link to={path} className={styles.card}>
      <div className={styles.cardIcon}>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  );
};

export default AdminCard;