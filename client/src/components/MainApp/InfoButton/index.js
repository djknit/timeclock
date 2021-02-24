import React from 'react';
import getStyle from './style';
import Button from '../../Button';

function InfoButton({
  style: styleProp,
  onClick,
  theme,
  allowTabFocus,
  disabled,
  shadowBlurRatio = 0.9,
  iconClassName = "fas fa-info"
}) {

  const style = getStyle(styleProp);

  return (
    <Button
      theme={theme || 'info light'}
      style={style.button}
      {...{
        onClick,
        allowTabFocus,
        disabled,
        shadowBlurRatio
      }}
    >
      <i className={iconClassName} style={style.icon} />
    </Button>
  );
}

export default InfoButton;
