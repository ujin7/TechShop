import React from 'react';
import styles from './Button.module.css';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md',         // 'sm' | 'md' | 'lg'
  isLoading = false,
  className = '',
  disabled,
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) {
  const classes = [
    styles.btn,
    styles[`variant-${variant}`],
    styles[`size-${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <>
          <span className={styles.spinner} />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />}
          {children}
        </>
      )}
    </button>
  );
}
