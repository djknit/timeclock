import React from 'react';
import getStyle from './style';
import { addPseudoPseudoClasses } from '../../../../../higherOrder';
import Tag from '../../../../../Tag';
import InfoButton from '../../../../InfoButton';

function _IconButtonTag_needsPseudo({
  onClick,
  theme,
  iconClassName,
  disabled,
  pseudoState,
  pseudoHandlers,
  style: styleProp
}) {

  const lightTheme = `${theme} light`;

  const style = getStyle(theme, pseudoState, styleProp);

  return (
    <Tag
      theme={lightTheme}
      {...pseudoHandlers}
      style={style.tag}
    >
      <InfoButton
        theme={lightTheme}
        {...{
          iconClassName,
          disabled,
          onClick
        }}
        shadowBlurRatio={0.65}
      />
    </Tag>
  );
}

const IconButtonTag = addPseudoPseudoClasses(_IconButtonTag_needsPseudo);

export default IconButtonTag;
