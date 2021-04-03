import { labelWeight, contentAreaDividerColor } from '../style';

export default function getStyle(styleProp) {
  const allTdStyle = {
    borderColor: contentAreaDividerColor
  };

  const numAmountTdStyle = {
    ...allTdStyle,
    textAlign: 'right'
  };

  return {
    tr: {
      ...styleProp
    },
    timesTd: {
      ...allTdStyle,
      textAlign: 'center'
    },
    firstColNoTimes: {
      ...allTdStyle,
      textAlign: 'right',
      fontWeight: labelWeight
    },
    durationTd: {
      ...numAmountTdStyle
    },
    payRateTd: {
      ...numAmountTdStyle
    },
    amountEarnedTd: {
      ...numAmountTdStyle
    },
    lastColNoTimes: {
      ...allTdStyle
    },
    amountEarnedTdNoEarnings: {
      ...allTdStyle,
      textAlign: 'center'
    }
  };
};
