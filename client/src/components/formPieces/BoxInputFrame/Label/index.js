import React from 'react';
import getStyle from './style';

function Label({
  inputId,
  style: styleProp,
  label,
  sublabel,
  isRadio,
  selectedRadioInput
}) {
  
  const style = getStyle(styleProp, isRadio);

  return label ? (
    <TopLevelElement
      {...{
        isRadio,
        selectedRadioInput
      }}
      htmlFor={inputId}
      className="label"
      style={style.label}
    >
      {label}
      {sublabel && (
        <span style={style.sublabel}>
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
    isRadio ? (
      <span
        {...attributes}
        aria-hidden
        onClick={() => {
          if (selectedRadioInput && selectedRadioInput.current) {
            selectedRadioInput.current.focus();
          }
        }}
      >
        {children}
      </span>
    ) : (
      <label {...attributes}>
        {children}
      </label>
    )
  );
}
