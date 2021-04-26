import {
  tableAreaStyleVars, topLevelAreaHeaderStyle, secondLevelHeaderStyle
} from '../style';

const {
  marginBetweenAreas, tableLeftPxMargin, tableRightPxMargin, bLevelAreaLeftPxPadding
} = tableAreaStyleVars;

export default function getStyle(isReportTotals) {
  let _tableMarginLeft = tableLeftPxMargin;
  if (isReportTotals) _tableMarginLeft += bLevelAreaLeftPxPadding;
  return {
    table: {
      marginBottom: marginBetweenAreas,
      marginLeft: _tableMarginLeft,
      marginRight: tableRightPxMargin
    },
    areaHeader: isReportTotals ? topLevelAreaHeaderStyle : secondLevelHeaderStyle
  };
};
