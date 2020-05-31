import React, { Component } from 'react';
import getStyle from './style';
import { addPseudoPseudoClasses } from '../higherOrder';

function _Button_needsPseudo({
  children,
  size,
  color,
  styles,
  onClick,
  disabled,
  formId,
  isSubmit,
  allowTabFocus,
  isLoading,
  pseudoState,
  pseudoHandlers
}) {

  let formRelatedAttributes = (
    isSubmit ?
    {
      form: formId,
      type: 'submit'
    } :
    { type: 'button' }
  );
  
  const completeStyle = getStyle(styles, pseudoState, color);

  const sizeClass = (
    size === 'none' ?
    '' :
    (size ? `is-${size}` : 'is-medium')
  );
  const colorClass = color ? `is-${color}` : 'is-light';
  const loadingClass = isLoading ? 'is-loading' : '';

  return (
    <button
      className={`button ${sizeClass} ${colorClass} ${loadingClass}`}
      style={completeStyle.button}
      {...pseudoHandlers}
      onClick={onClick}
      disabled={disabled}
      {...formRelatedAttributes}
      tabIndex={allowTabFocus !== false ? 0 : -1}
    >
      {children}
    </button>
  );
}

const Button = addPseudoPseudoClasses(_Button_needsPseudo);

export default Button;      