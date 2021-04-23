import React from 'react';
import getStyle from './style';
import { getClickableElAttrs } from '../../utilities';
import Tag from '../../../../../Tag';
import { addPseudoPseudoClasses } from '../../../../../higherOrder';

function _ButtonTag_needsPseudo({
  theme: themeProp,
  iconName,
  handleClick: clickHandlerProp,
  disabled,
  children,
  pseudoState,
  pseudoHandlers,
  style: styleProp
}) {

  let theme = themeProp;
  if (!pseudoState.isHovered && !pseudoState.isFocused && !pseudoState.isActive) {
    theme += ' light';
  }

  const handleClick = !disabled ? clickHandlerProp : undefined;

  const style = getStyle(themeProp, pseudoState, styleProp);

  return (
    <Tag
      {...{ theme }}
      style={style.tag}
      {...getClickableElAttrs(handleClick, disabled)}
      {...pseudoHandlers}
    >
      {iconName && (
        <i className={`fas fa-${iconName}`} style={style.icon} />
      )}
      {children}
    </Tag>
  );
}

const ButtonTag = addPseudoPseudoClasses(_ButtonTag_needsPseudo);

export default ButtonTag;
