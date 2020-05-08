import React from 'react';

function Notification({
  children,
  theme
}) {

  let className = 'notification';
  if (theme) className += ` is-${theme}`;

  return (
    <div className={className}>
      {children}
    </div>
  );
}

export default Notification;