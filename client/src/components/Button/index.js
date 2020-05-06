import React from 'react';

function Button({
  children,
  size,
  color
}) {

  const sizeClass = size ? `is-${size}` : 'is-medium';
  const colorClass = color ? `is-color` : 'is-light'

  return (
    <button className={`button ${sizeClass} ${colorClass}`}>
      {children}
    </button>
  );
}

export default Button;