
import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div className={`animate-spin rounded-full border-primary border-t-transparent ${sizeClasses[size]} ${className}`}></div>
  );
};

export default LoadingSpinner;
