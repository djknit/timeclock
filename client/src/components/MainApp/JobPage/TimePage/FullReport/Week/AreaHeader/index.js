import React from 'react';
import getStyle from './style';
import { getWeekDateRangeText } from '../../utilities';
import InnerAreaHeader from '../../../InnerAreaHeader';

function WeekHeader({
  isPartial,
  weekNumber,
  dateRange,
}) {

  const style = getStyle();

  const dateRangeDispTxt = getWeekDateRangeText({ dateRange });
  
  let dateRangeAsterisk, childStyle, grandchildren;

  if (isPartial) {
    dateRangeAsterisk = <>&#8202;*</>;
    childStyle = style.areaHeaderPartialWeek;
    grandchildren = (
      <p style={style.partialWeekNote}>
        <span style={style.partWkNoteAsterisk}>*</span>&#8202;Includes dates outside the scope of this report
      </p>
    );
  }

  return (
    <InnerAreaHeader
      label={(
        <>
          <span style={style.primaryLabel}>
            Week #&#8202;{weekNumber}
          </span> <span style={style.sublabel}>
            ({dateRangeDispTxt}){dateRangeAsterisk}
          </span>
        </>
      )}
      style={childStyle}
      children={grandchildren}
    />
  );
}

export default WeekHeader;
