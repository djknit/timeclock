import React from 'react';

function Label({
  inputId,
  style,
  label,
  sublabel,
  isRadio
}) {

  return label ? (
    <TopLevelElement
      {...{ isRadio }}
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
    </TopLevelElement>
  ) : (
    <></>
  );
}

export default Label;

function TopLevelElement({ children, isRadio, ...attributes }) {
  return (
    isRadio ?
    <legend {...attributes}>{children}</legend> :
    <label {...attributes}>{children}</label>
  );
}