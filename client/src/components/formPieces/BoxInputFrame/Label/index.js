import React from 'react';
import getStyle from './style';

function Label({
  inputId,
  style,
  label,
  sublabel,
  isRadio,
  selectedRadioInput
}) {
  
  const completeStyle = getStyle();

  return label ? (
    <TopLevelElement
      {...{
        isRadio,
        selectedRadioInput
      }}
      htmlFor={inputId}
      className="label"
      style={style}
    >
      {label}
      {sublabel && (
        <span style={completeStyle.normalWeight}>
          &nbsp;({sublabel})
        </span>
      )}
    </TopLevelElement>
  ) : (
    <></>
  );
}

export default Label;

function TopLevelElement({ children, isRadio, selectedRadioInput, ...attributes }) {
  return (
    isRadio ?
    <span
      {...attributes}
      aria-hidden
      onClick={() => {
        if (selectedRadioInput && selectedRadioInput.current) {
          selectedRadioInput.current.focus();
          setTimeout(
            () => selectedRadioInput.current.focus(),
            250
          );
        }
      }}
    >
      {children}
    </span> :
    <label {...attributes}>
      {children}
    </label>
  );
}