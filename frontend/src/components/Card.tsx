'use client';

import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-dark-800 border border-dark-700 rounded-lg p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold text-dark-50 mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
