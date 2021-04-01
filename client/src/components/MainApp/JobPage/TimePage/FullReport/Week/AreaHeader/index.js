import React from 'react';
import getStyle, { headerStyleVars } from './style';
import { getWeekDateRangeText, XtSp } from '../../utilities';
import InnerAreaHeader from '../../../InnerAreaHeader';

function WeekHeader({
  isPartial,
  weekNumber,
  dateRange,
}) {

  const style = getStyle(isPartial);
  
  const dateRangeDispTxt = getWeekDateRangeText({ dateRange });
  
  let dateRangeAsterisk, grandchildren;
  
  if (isPartial) {
    dateRangeAsterisk = <><XtSp />*</>;
    grandchildren = (
      <p style={style.partialWeekNote}>
        <span style={style.partWkNoteAsterisk}>*</span><XtSp />Includes dates outside the scope of this report
      </p>
    );
  }

  return (
    <InnerAreaHeader
      label={(
        <>
          <span style={style.primaryLabel}>
            Week #<XtSp/>{weekNumber}
          </span> <span style={style.sublabel}>
            ({dateRangeDispTxt}){dateRangeAsterisk}
          </span>
        </>
      )}
      style={style.areaHeader}
      children={grandchildren}
      styleVariables={headerStyleVars}
      isInSection
    />
  );
}

export default WeekHeader;
