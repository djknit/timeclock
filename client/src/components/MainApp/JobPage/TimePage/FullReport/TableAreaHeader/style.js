import { topLevelAreaHeaderStyle, topLevelAreaHeaderStyleVars } from '../style';

const { lineHeight } = topLevelAreaHeaderStyleVars;
const normalHeadingFontWeight = 600;

export default function getStyle(isReportTotals, styleProp) {
  let { fontWeight = normalHeadingFontWeight } = topLevelAreaHeaderStyle;
  if (isReportTotals) fontWeight += 100;
  return {
    header: {
      textAlign: 'left',
      fontWeight,
      ...(isReportTotals && topLevelAreaHeaderStyle),
      ...styleProp
    }
  };
};

export { getHeaderStyleVars };


function getHeaderStyleVars(isTotals, styleVarsProp) {
  let labelFontWeight = normalHeadingFontWeight;
  if (isTotals) labelFontWeight += 100;
  return {
    dividerHeight: '2px',
    labelEmFontSize: 1,
    labelFontWeight,
    lineHeight,
    ...styleVarsProp
  };
}
