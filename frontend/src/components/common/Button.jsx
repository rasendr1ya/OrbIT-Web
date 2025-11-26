import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  fullWidth = false,
}) => {
  const baseStyles = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500 disabled:bg-blue-300',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-500 disabled:bg-gray-100',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 disabled:bg-red-300',
    success: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500 disabled:bg-green-300',
    outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
