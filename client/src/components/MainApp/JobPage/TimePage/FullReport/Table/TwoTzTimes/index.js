import React from 'react';
import Times from '../Times';
import DropDown from '../DropDown';

function TwoTzTimes({
  dayDate,
  primaryTimezone,
  primaryTimezoneTimes,
  secondaryTimezone,
  secondaryTimezoneTimes,
}) {

  return (
    <>
      <Times
        {...primaryTimezoneTimes}
        {...{ dayDate }}
        timezone={primaryTimezone}
      />
      <DropDown>
        <Times
          {...secondaryTimezoneTimes}
          {...{ dayDate }}
          timezone={secondaryTimezone}
        />
      </DropDown>
    </>
  );
}

export default TwoTzTimes;
