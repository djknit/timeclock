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
  sizeRatio = 1.1
}) {

  const style = getStyle(sizeRatio);
  console.log('sched entry btn styles prop\n')
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
