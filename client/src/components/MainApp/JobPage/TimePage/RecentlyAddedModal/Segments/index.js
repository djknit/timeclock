import React from 'react';
import getStyle, { dividerMargin, getSegmentsAddedOnDayStyle } from './style';
import {
  separateSegsByDateCreated,
  dates as dateUtils,
  getDateAddedOnText,
  capitalizeFirstLetter
} from '../utilities';
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

  const commonSegProps = {
    toggleDeleteSegmentModal,
    toggleEditSegmentModal,
    disabled,
    handleSegUpdateSuccess
  };

  const style = getStyle(!!segments);
  
  return (
    (segments && segments.length > 0) ? (
      segsGroupedByCreatedDate.map((dateAndSegs, index) => (
        <React.Fragment key={getUtcDateTime(dateAndSegs.date)}>
          <SegmentsAddedOnDay
            {...dateAndSegs}
            segmentProps={commonSegProps}
          />
          {index < segsGroupedByCreatedDate.length - 1 && (
            <hr style={style.divider} />
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

  const style = getSegmentsAddedOnDayStyle();

  return (
    <>
      <p style={style.areaLabel}>
        Added {capitalizeFirstLetter(getDateAddedOnText(date, true))}:
      </p>
      {segments.map((segment, index) =>
        <Segment
          {...{ segment }}
          {...segmentProps}
          key={segment._id}
          groupMargin={index < segments.length - 1 ? dividerMargin : 0}
        />
      )}
    </>
  );
}
