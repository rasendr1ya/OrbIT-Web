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
  const baseStyles = 'font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center';

  const variants = {
    primary: 'bg-black hover:bg-gray-800 text-white active:bg-gray-900 focus:ring-black',
    secondary: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 active:bg-gray-100 focus:ring-gray-900',
    danger: 'bg-white hover:bg-red-50 text-red-600 border border-red-200 active:bg-red-100 focus:ring-red-600',
    success: 'bg-white hover:bg-green-50 text-green-600 border border-green-200 active:bg-green-100 focus:ring-green-600',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 active:bg-gray-200 focus:ring-gray-900',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
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
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
