import React from 'react';
import getStyle from './style';
import { getTimezoneAbbreviation } from '../utilities';


function Table({
  hasTimes,
  primaryTimezone,
  secondaryTimezone,
  data,
  primaryTzLabel,
  secondaryTzLabel,
  date
}) {

  let firstColLabel, lastColLabel;

  if (hasTimes) {
    firstColLabel = (
      primaryTzLabel ||
      `Times (${getTimezoneAbbreviation(primaryTimezone)})`
    );
    lastColLabel = (
      secondaryTzLabel ||
      `Job Timezone (${getTimezoneAbbreviation(secondaryTimezone, date)})`
    );
  }

  const primaryTzDefaultLabel = (
    primaryTzLabel || `Times (${getTimezoneAbbreviation(primaryTimezone)})`
  );

  const style = getStyle();

  return (
    <table>
      <thead>
        <th span={3}>
          {hasTimes && (
            primaryTzLabel || primaryTzDefaultLabel
          )}
        </th>
        <th>
          Hours Worked
        </th>
        <th>
          Pay Rate
        </th>
        <th>
          Amount Earned
        </th>
        {secondaryTimezone && (
          <th span={3}>
            {hasTimes && (
              secondaryTzLabel || ''
            )}
          </th>
        )}
      </thead>
      <tbody>
        {data && data.map(row => (
          <row>
            <td></td>
            <td>&ndash;</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            {secondaryTimezone && (
              <>
                <td></td>
                <td></td>
                <td></td>
              </>
            )}
          </row>
        ))}
      </tbody>
    </table>
  );
}
