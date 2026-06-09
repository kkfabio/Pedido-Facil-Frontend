import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, ...props }: ButtonProps) => {
  const variantClass = variant === 'primary' ? styles.btnPrimary : styles.btnSecondary;

  return (
    <button className={`${styles.btn} ${variantClass}`} {...props}>
      {children}
    </button>
  );
};