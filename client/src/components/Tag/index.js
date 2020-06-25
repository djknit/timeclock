import React from 'react';

function Tag({
  children,
  theme
}) {

  const colorClass = color && `is-${color}`;

  return (
    <span className={`tag ${colorClass || ''}`}>
      {children}
    </span>
  );
}

function TagGroup({ children }) {
  return (
    <div className="tags has-addons">{children}</div>
  );
}

export default Tag;

export { TagGroup };