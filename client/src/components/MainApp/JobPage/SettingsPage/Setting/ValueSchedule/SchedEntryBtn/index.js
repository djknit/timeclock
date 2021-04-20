import React from 'react';
import getStyle from './style';
import Button from '../../../../../../Button';

function SchedEntryButton({
  text,
  toggle,
  iconClass,
  isRemove,
  schedEntryId,
  areAnyModalsOpen,
  sizeRatio = 1.1,
  style: styleProp
}) {

  const style = getStyle(sizeRatio, styleProp);

  return (
    <Button
      style={style.button}
      theme={isRemove ? 'danger' : 'primary'}
      onClick={() => toggle(true, schedEntryId)}
      allowTabFocus={!areAnyModalsOpen}
    >
      <i className={iconClass} />&ensp;{text}
    </Button>
  );
}

export default SchedEntryButton;
