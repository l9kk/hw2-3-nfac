import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors focus:outline-none';
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark disabled:opacity-50',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
