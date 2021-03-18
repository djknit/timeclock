import React from 'react';
import getStyle from './style';
import { getColorClass } from '../utilities';

function Notification({
  children,
  theme,
  close,
  messages,
  isLastChild,
  style: styleProp,
  disabled
}) {

  const style = getStyle(isLastChild);

  let className = 'notification';
  if (theme) className += ` ${getColorClass(theme)}`;

  const _close = (event) => {
    event.preventDefault();
    close();
  }

  return (
    <div {...{ className }} style={{ ...style.notification, ...styleProp }}>
      {close && (
        <button className="delete" onClick={_close} type="button" {...{ disabled }} />
      )}
      {messages && (
        messages.map(
          (msg, index, arr) => (
            <NotificationText
              key={index}
              isLast={index === arr.length - 1 && !children}
            >
              {msg}
            </NotificationText>
          )
        )
      )}
      {children}
    </div>
  );
}

export default Notification;

function NotificationText({
  isLast,
  children,
  style: styleProp
}) {

  const pStyle = getStyle()[isLast ? 'lastP' : 'p'];
  
  return (
    <p style={{ ...pStyle, ...styleProp }}>
      {children}
    </p>
  );
}

export { NotificationText };
