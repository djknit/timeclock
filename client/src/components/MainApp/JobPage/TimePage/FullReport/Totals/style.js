import {
  tableAreaStyleVars,
  topLevelTotalsHeaderStyle,
  topLevelTotalsHeaderStyleVars,
  secondLevelTotalsHeaderStyle,
  secondLevelTotalsHeaderStyleVars
} from '../style';

const {
  marginBetweenAreas, tableLeftPxMargin, tableRightPxMargin, bLevelAreaLeftPxPadding
} = tableAreaStyleVars;

export default function getStyle(isReportTotals) {
  let _tableMarginLeft = tableLeftPxMargin;
  if (isReportTotals) _tableMarginLeft += bLevelAreaLeftPxPadding;
  return {
    table: {
      marginBottom: !isReportTotals ? marginBetweenAreas : undefined,
      marginLeft: _tableMarginLeft,
      marginRight: tableRightPxMargin
    },
    areaHeader: isReportTotals ? topLevelTotalsHeaderStyle : secondLevelTotalsHeaderStyle
  };
};

export { getHeaderStyleVars };


function getHeaderStyleVars(isReportTotals) {
  return {
    ...(isReportTotals ? topLevelTotalsHeaderStyleVars : secondLevelTotalsHeaderStyleVars)
  };
}
