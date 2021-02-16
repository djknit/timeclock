import React from 'react';
import getStyle from './style';
import { formatMyDate, formatSegmentTimes, formatDuration } from '../utilities';
import Tag, { TagGroup } from '../../../../Tag';
import ButtonTag from './ButtonTag';

function Segment({
  segment,
  toggleDeleteSegmentModal,
  toggleEditSegmentModal,
  disabled,
  handleSegUpdateSuccess,
  groupMargin,
  tagMargin
}) {

  const style = getStyle();

  const _getCommonBtnProps = _toggleModal => ({
    disabled,
    handleClick: () => _toggleModal(true, segment, handleSegUpdateSuccess)
  });

  return (
    <TagGroup
      size="medium"
      align="center"
      {...{
        groupMargin,
        tagMargin
      }}
    >
      <Tag theme="info light">
        {formatMyDate(segment.date)}
      </Tag>
      <Tag theme="info">
        {formatSegmentTimes(segment)}
      </Tag>
      <Tag>
        {formatDuration(segment.duration)}
      </Tag>
      <ButtonTag
        theme="primary"
        iconName="edit"
        {..._getCommonBtnProps(toggleEditSegmentModal)}
      />
      <ButtonTag
        theme="danger"
        iconName="trash-alt"
        {..._getCommonBtnProps(toggleDeleteSegmentModal)}
      />
    </TagGroup>
  );
}

export default Segment;
