import React from 'react';
import getStyle from './style';
import { getTimezoneAbbreviation } from '../utilities';
import THead from './Head';
import Row from './Row';

function Table({
  hasTimes,
  primaryTimezone,
  secondaryTimezone,
  primaryTzLabel,
  secondaryTzLabel,
  date,
  hasSecondTzCols,
  hasEarningCols
}) {

  const style = getStyle();

  return (
    <table>
      <THead
        {...{
          hasTimes,
          primaryTimezone,
          secondaryTimezone,
          primaryTzLabel,
          secondaryTzLabel,
          date,
          hasSecondTzCols,
          hasEarningCols
        }}
      />
      <tbody>
        {data.map(rowData => (
          <Row {...{ hasTimes, hasSecondTzCol, hasEarningCols, rowData }} />
        ))}
      </tbody>
    </table>
  );
}

export default Table;
