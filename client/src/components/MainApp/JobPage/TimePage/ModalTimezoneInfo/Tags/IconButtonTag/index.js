import React from 'react';
import getStyle from './style';
import Tag from '../../../../../../Tag';
import InfoButton from '../../../../../../InfoButton';

function IconButtonTag({
  onClick,
  theme,
  iconClassName,
  disabled,
  style: styleProp,
  isTagGroupEngaged
}) {

  const lightTheme = `${theme} light`;

  const style = getStyle(styleProp, isTagGroupEngaged);

  return (
    <Tag
      theme={lightTheme}
      style={style.tag}
    >
      <InfoButton
        theme={isTagGroupEngaged ? theme : lightTheme}
        {...{
          iconClassName,
          disabled,
          onClick,
          isTagGroupEngaged
        }}
        style={style.button}
        shadowBlurRatio={isTagGroupEngaged ? 1 : 0.5}
      />
    </Tag>
  );
}

export default IconButtonTag;
