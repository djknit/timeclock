import { labelWeight, contentAreaDividerColor, cellXPadding, cellYPadding } from '../style';

export default function getStyle(styleProp, colWidths = {}, isFirstRowInGroup) {

  const borderTopPxWidth = isFirstRowInGroup ? 1.5 : 0.7;
  const td = {
    borderColor: contentAreaDividerColor,
    borderWidth: `${borderTopPxWidth}px 0 0`,
    padding: `${cellYPadding} ${cellXPadding}`
  };
  const numAmountTd = {
    ...td,
    textAlign: 'right'
  };

  return {
    tr: {
      ...styleProp
    },
    timesTd: {
      ...td,
      textAlign: 'center',
      width: colWidths.times
    },
    firstColNoTimes: {
      ...td,
      textAlign: 'right',
      fontWeight: labelWeight,
      width: colWidths.times
    },
    durationTd: {
      ...numAmountTd,
      width: colWidths.duration
    },
    payRateTd: {
      ...numAmountTd,
      width: colWidths.payRate
    },
    amountEarnedTd: {
      ...numAmountTd,
      width: colWidths.amountEarned
    },
    payRateTdUnpaid: {
      ...numAmountTd,
      paddingRight: `calc(${cellXPadding} + 1.5em)`,
      width: colWidths.payRate
    },
    amountEarnedTdUnpaid: {
      ...numAmountTd,
      paddingRight: `calc(${cellXPadding} + 0.75em)`,
      width: colWidths.amountEarned
    },
    secondaryTzTimes: {
      ...td,
      width: colWidths.secondaryTzTimes
    },
  };
};
