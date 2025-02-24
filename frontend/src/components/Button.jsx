// src/components/Button.jsx
import React from 'react';

const Button = ({ label, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded bg-purple-500 text-white hover:bg-purple-700 ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
