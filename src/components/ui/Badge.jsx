import React from 'react';
import styles from './Badge.module.css';

export default function Badge({ children, variant = 'new', className = '' }) {
  const classes = [styles.badge, styles[`variant-${variant}`], className]
    .filter(Boolean)
    .join(' ');

  return <span className={classes}>{children}</span>;
}
