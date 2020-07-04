import React from 'react';
import getStyle from './style';
import { getColorClass, getSizeClass } from '../utilities';
import { addPseudoPseudoClasses } from '../higherOrder';

function _Button_needsPseudo({
  children,
  size,
  theme,
  styles,
  onClick,
  disabled,
  formId,
  isSubmit,
  allowTabFocus,
  isLoading,
  pseudoState,
  pseudoHandlers,
  buttonRef
}) {

  let formRelatedAttributes = (
    isSubmit ?
    {
      form: formId,
      type: 'submit'
    } :
    { type: 'button' }
  );
  
  const completeStyle = getStyle(styles, pseudoState, theme);

  const sizeClass = getSizeClass(size || 'medium');
  const colorClass = getColorClass(theme || 'light');
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
      ref={buttonRef}
    >
      {children}
    </button>
  );
}

const Button = addPseudoPseudoClasses(_Button_needsPseudo);

export default Button;      