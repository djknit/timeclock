import React from 'react';

function SchedEntryButton({
  text,
  toggle,
  iconClass,
  isRemove,
  schedEntryId,
  areAnyModalsOpen,
  styles = {}
}) {
  return (
    <Button
      {...styles}
      theme={isRemove ? 'danger' : 'primary'}
      onClick={() => toggle(true, schedEntryId)}
      allowTabFocus={!areAnyModalsOpen}
    >
      <i className={iconClass} />&ensp;{text}
    </Button>
  );
}

export default SchedEntryButton;
