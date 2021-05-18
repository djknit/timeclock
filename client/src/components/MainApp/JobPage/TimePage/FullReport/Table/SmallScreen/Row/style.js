import { labelWeight, contentAreaDividerColor, cellXPadding, cellYPadding } from '../style';

export default function getStyle(styleProp, colWidths = {}, isFirstRowInGroup) {

  const borderTopPxWidth = isFirstRowInGroup ? 1.5 : 0.7;
  const td = {
    borderColor: contentAreaDividerColor,
    borderWidth: `${borderTopPxWidth}px 0 0`,
    whiteSpace: 'nowrap',
    padding: `${cellYPadding} ${cellXPadding}`
  };

  const amountValuePart = {
    display: 'inline-block',
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
    amountsTd: {
      ...td,
      textAlign: 'right',
      width: colWidths.amounts
    },
    amountValueRightPart: {
      ...amountValuePart,
      textAlign: 'left',
    }
  };
};
