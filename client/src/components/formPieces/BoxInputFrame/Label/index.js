import React from 'react';

function Label({
  inputId,
  style,
  label,
  sublabel
}) {

  return label ? (
    <label
      htmlFor={inputId}
      className="label"
      style={style}
    >
      {label}
      {sublabel && (
        <span style={style.normalWeight}>
          &nbsp;({sublabel})
        </span>
      )}
    </label>
  ) : (
    <></>
  );
}

export default Label;