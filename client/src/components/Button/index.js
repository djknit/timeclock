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
  allowTabFocus = true,
  isLoading,
  pseudoState,
  pseudoHandlers,
  buttonRef,
  isLink,
  to,
  shadowBlurRatio
}) {

  let formRelatedAttributes = (
    isSubmit ?
    {
      form: formId,
      type: 'submit'
    } :
    { type: 'button' }
  );
  
  const completeStyle = getStyle(styles, pseudoState, theme, styleProp, shadowBlurRatio);

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
        {...commonAttrs}
        {...{
          to,
          children
        }}
      />
    ) : (
      <button
        {...commonAttrs}
        {...{
          onClick,
          children
        }}
        {...formRelatedAttributes}
      />
    )
  );
}

const Button = addPseudoPseudoClasses(_Button_needsPseudo);

export default Button;
