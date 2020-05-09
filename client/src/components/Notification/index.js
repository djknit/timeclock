import React from 'react';
import getStyle from './style';

function Notification({
  children,
  theme,
  close
}) {

  const style = getStyle();

  let className = 'notification';
  if (theme) className += ` is-${theme}`;

  const _close = (event) => {
    event.preventDefault();
    close();
  }

  return (
    <div className={className} style={style.notification}>
      {close && (
        <button className="delete" onClick={_close}></button>
      )}
      {children}
    </div>
  );
}

export default Notification;

function NotificationText({
  isLast,
  children
}) {

  const style = getStyle();
  
  return (
    <p style={isLast ? style.lastP : style.p}>
      {children}
    </p>
  );
}

export { NotificationText };