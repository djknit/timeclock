import React from 'react';
import getStyle from './style';
import { separateSegsByDateCreated, formatMyDate, dates as dateUtils } from '../utilities';
import Segment from '../../SegmentTags';

const { getUtcDateTime } = dateUtils;

function Segments({
  segments,
  toggleDeleteSegmentModal,
  toggleEditSegmentModal,
  disabled,
  handleSegUpdateSuccess
}) {

  const segsGroupedByCreatedDate = separateSegsByDateCreated(segments);

  console.log(segsGroupedByCreatedDate)

  const commonSegProps = {
    toggleDeleteSegmentModal,
    toggleEditSegmentModal,
    disabled,
    handleSegUpdateSuccess
  };

  const style = getStyle();
  
  return (
    (segments && segments.length > 0) ? (
      segsGroupedByCreatedDate.map((dateAndSegs, index) => (
        <React.Fragment key={getUtcDateTime(dateAndSegs.date)}>
          <SegmentsAddedOnDay
            {...dateAndSegs}
            segmentProps={commonSegProps}
          />
          {index < segsGroupedByCreatedDate.length - 1 && (
            <hr />
          )}
        </React.Fragment>
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


function SegmentsAddedOnDay({
  date,
  segments,
  segmentProps
}) {
  return (
    <>
      {segments.map(segment =>
        <Segment
          {...{ segment }}
          {...segmentProps}
          key={segment._id}
        />  
      )}
    </>
  );
}
