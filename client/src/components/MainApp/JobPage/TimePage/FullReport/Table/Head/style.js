import { labelWeight, contentAreaDividerColor, cellXPadding, cellYPadding } from '../style';

const bottomBorderWidth = '1.5px';

export default function getStyle(styleProp, colWidths = {}) {
  const th = {
    fontWeight: labelWeight,
    border: `${bottomBorderWidth} solid ${contentAreaDividerColor}`,
    borderWidth: `0 0 ${bottomBorderWidth}`,
    padding: `${cellYPadding} ${cellXPadding}`,
    verticalAlign: 'bottom'
  };

  const numAmountTh = {
    ...th,
    textAlign: 'right'
  };

  return {
    tr: {
      ...styleProp
    },
    timesTh: {
      ...th,
      textAlign: 'center',
      width: colWidths.times
    },
    firstColNoTimes: {
      ...th,
      textAlign: 'right',
      fontWeight: labelWeight,
      width: colWidths.times
    },
    valuesTh: {
      ...numAmountTh,
      width: colWidths.values
    },
    durationTh: {
      ...numAmountTh,
      width: colWidths.duration
    },
    payRateTh: {
      ...numAmountTh,
      width: colWidths.payRate
    },
    amountEarnedTh: {
      ...numAmountTh,
      width: colWidths.amountEarned
    },
    secondaryTzTimesTh: {
      ...th,
      textAlign: 'center',
      width: colWidths.secondaryTzTimes
    }
  };
};

