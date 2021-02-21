import React from 'react';
import { Link } from 'react-router-dom';
import getStyle from './style';
import { getColorClass, getSizeClass } from '../utilities';
import { addPseudoPseudoClasses } from '../higherOrder';

function _Button_needsPseudo({
  children,
  size,
  theme,
  styles,
  style: styleProp,
  onClick,
  disabled,
  formId,
  isSubmit,
  allowTabFocus,
  isLoading,
  pseudoState,
  pseudoHandlers,
  buttonRef,
  isLink,
  to
}) {

  let formRelatedAttributes = (
    isSubmit ?
    {
      form: formId,
      type: 'submit'
    } :
    { type: 'button' }
  );
  
  const completeStyle = getStyle(styles, pseudoState, theme, styleProp);

  const sizeClass = getSizeClass(size || 'medium');
  const colorClass = getColorClass(theme || 'light');
  const loadingClass = isLoading ? 'is-loading' : '';

  const commonAttrs = {
    className: `button ${sizeClass} ${colorClass} ${loadingClass}`,
    style: completeStyle.button,
    ...pseudoHandlers,
    disabled,
    tabIndex: allowTabFocus !== false ? 0 : -1,
    ref: buttonRef
  };

  return (
    isLink ? (
      <Link
        {...{
          ...commonAttrs,
          to
        }}
      >
        {children}
      </Link>
    ) : (
      <button
        {...{
          ...commonAttrs,
          onClick,
          ...formRelatedAttributes
        }}
      >
        {children}
      </button>
    )
  );
}

const Button = addPseudoPseudoClasses(_Button_needsPseudo);

export default Button;      