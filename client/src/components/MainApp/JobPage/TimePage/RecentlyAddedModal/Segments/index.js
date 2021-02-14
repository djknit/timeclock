import React from 'react';
import getStyle from './style';
import Segment from '../../SegmentTags';

function Segments({
  segments,
  toggleDeleteSegmentModal,
  toggleEditSegmentModal,
  disabled,
  handleSegUpdateSuccess
}) {
  console.log(segments)

  const style = getStyle();
  
  return (
    (segments && segments.length > 0) ? (
      segments.map(segment => (
        <Segment
          {...{
            segment,
            toggleDeleteSegmentModal,
            toggleEditSegmentModal,
            disabled,
            handleSegUpdateSuccess
          }}
          key={segment._id}
        />
      ))
    ) : (
      <p style={style.noSegsText}>
        {segments ? (
          <>No segments found.</>
        ) : (
          <>Segments will appear here when there is a valid input entered above.</>
        )}
      </p>
    )
  );
}

export default Segments;
