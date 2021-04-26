import React from 'react';
import getStyle from './style';

function FieldMessages({
  problemMessages,
  helpText
}) {

  const helpMessages = Array.isArray(helpText) ? helpText : [helpText];

  const style = getStyle();

  return (
    <>
      {problemMessages && problemMessages.length > 0 && problemMessages.map(
        msg => (
          <p className="help is-danger" key={msg} style={style.message}>
            {msg}
          </p>
        )
      )}
      {helpText && helpMessages.map(
        msg => (
          <p className="help" key={msg} style={style.message}>
            {msg}
          </p>
        )
      )}
    </>
  );
}

export default FieldMessages;
