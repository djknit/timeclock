import { labelWeight, contentAreaDividerColor } from '../style';

export default function getStyle(styleProp, isFirstRowInGroup) {

  const borderTopPxWidth = isFirstRowInGroup ? 1.5 : 0.7;

  const allTdStyle = {
    borderColor: contentAreaDividerColor,
    borderWidth: `${borderTopPxWidth}px 0 0`
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
    amountEarnedTdUnpaid: {
      ...allTdStyle,
      textAlign: 'center'
    },
    payRateTdUnpaid: {
      ...numAmountTdStyle
    },
  };
};
