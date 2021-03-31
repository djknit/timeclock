import { labelWeight } from '../style';

export default function getStyle(styleProp) {
  const numAmountTdStyle = {
    textAlign: 'right'
  };

  return {
    tr: {
      ...styleProp
    },
    timesTd: {
      textAlign: 'center'
    },
    firstColNoTimes: {
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
      
    }
  };
};
