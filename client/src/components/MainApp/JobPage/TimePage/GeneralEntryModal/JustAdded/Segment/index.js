import React from 'react';
import getStyle from './style';
import { formatMyDate, formatSegmentTimes, formatDuration } from '../../utilities';
import Tag, { TagGroup } from '../../../../../../Tag';
import { addPseudoPseudoClasses } from '../../../../../../higherOrder';

function _Segment_needsPseudo({
  segment,
  pseudoState,
  pseudoHandlers,
  toggleDeleteSegmentModal,
  disabled
}) {

  const style = getStyle(pseudoState, disabled);

  let deleteTheme = 'danger';
  if (!pseudoState.isHovered && !pseudoState.isFocused && !pseudoState.isActive) {
    deleteTheme += ' light';
  }

  return (
    <TagGroup size="medium" align="center">
      <Tag theme="info light">
        {formatMyDate(segment.date)}
      </Tag>
      <Tag theme="info">
        {formatSegmentTimes(segment)}
      </Tag>
      <Tag>
        {formatDuration(segment.duration)}
      </Tag>
      <Tag
        theme={deleteTheme}
        style={style.deleteTag}
        {...pseudoHandlers}
        onClick={!disabled && (
          () => toggleDeleteSegmentModal(true, segment)
        )}
        tabIndex={disabled ? -1 : 0}
      >
        <i className="fas fa-trash-alt" />
      </Tag>
    </TagGroup>
  );
}

const Segment = addPseudoPseudoClasses(_Segment_needsPseudo);

export default Segment;
