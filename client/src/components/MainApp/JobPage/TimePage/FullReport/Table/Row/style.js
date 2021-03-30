export default function getStyle(styleProp) {
  const numAmountTdStyle = {
    textAlign: 'right'
  };

  return {
    tr: {
      ...styleProp
    },
    timesTd: {},
    durationTd: {
      ...numAmountTdStyle
    },
    payRateTd: {
      ...numAmountTdStyle
    },
    amountEarnedTd: {
      ...numAmountTdStyle
    },
    firstColNoTimes: {},
    lastColNoTimes: {}
  };
};
