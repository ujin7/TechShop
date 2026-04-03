import React from 'react';
import styles from './Skeleton.module.css';

/**
 * @param {object} props
 * @param {'text' | 'circle' | 'rect'} props.variant 
 * @param {string | number} props.width
 * @param {string | number} props.height
 * @param {string} props.className
 */
export default function Skeleton({ 
  variant = 'text', 
  width, 
  height, 
  className = '', 
  ...props 
}) {
  const classes = [
    styles.skeleton,
    styles[`variant-${variant}`],
    className
  ].filter(Boolean).join(' ');

  const style = {
    width: width || (variant === 'text' ? '100%' : 'auto'),
    height: height || (variant === 'text' ? 'auto' : '100%'),
  };

  return (
    <div className={classes} style={style} {...props} />
  );
}
