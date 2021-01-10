import React from 'react';
import getStyle from './style';
import Tag, { TagGroup } from '../../../../../Tag';

function JustAdded({
  justAdded,
  toggleDeleteSegmentModal
}) {

  const style = getStyle();

  return (true || (justAdded && justAdded.length > 0)) ? (
    <>
      <h3 className="subtitle" style={style.title}>
        Just Added
      </h3>
      {justAdded.map(segment => (
        <TagGroup>
          <Tag>
            {segment.date}afwefjio
          </Tag>
        </TagGroup>
      ))}
    </>
  ) : (
    <></>
  );
}

export default JustAdded;
