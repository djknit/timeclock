import { tableAreaStyleVars, topLevelAreaHeaderStyle } from '../style';

const {
  marginBetweenAreas, tableLeftPxMargin, tableRightPxMargin, bLevelAreaLeftPxPadding
} = tableAreaStyleVars;

export default function getStyle(isReportTotals) {
  console.log('get totals table style\n  >>>> "topLevelAreaHeaderStyle":\n', topLevelAreaHeaderStyle)
  let style = {
    table: {
      marginBottom: marginBetweenAreas,
      marginLeft: tableLeftPxMargin,
      marginRight: tableRightPxMargin
    }
  };
  if (isReportTotals) {
    style.table.marginLeft += bLevelAreaLeftPxPadding;
    style.table.marginRight += bLevelAreaLeftPxPadding;
    style.areaHeader = topLevelAreaHeaderStyle;
  }
  return style;
};
