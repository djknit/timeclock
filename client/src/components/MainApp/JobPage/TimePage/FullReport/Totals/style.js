import { tableAreaStyleVars, topLevelAreaHeaderStyle } from '../style';

const {
  marginBetweenAreas, tableLeftPxMargin, tableRightPxMargin, bLevelAreaLeftPxPadding
} = tableAreaStyleVars;

export default function getStyle(isReportTotals) {
  let style = {
    table: {
      marginBottom: marginBetweenAreas,
      marginLeft: tableLeftPxMargin,
      marginRight: tableRightPxMargin
    }
  };
  if (isReportTotals) {
    style.table.marginLeft += bLevelAreaLeftPxPadding;
    style.areaHeader = topLevelAreaHeaderStyle;
  }
  return style;
};
