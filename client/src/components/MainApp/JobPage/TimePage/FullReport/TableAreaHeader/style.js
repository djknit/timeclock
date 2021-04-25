import { topLevelAreaHeaderStyle } from '../style';
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
  const labelEmFontSize = 1;
  const labelFontWeight = (
    isTotals ?
    topLevelAreaHeaderStyle.fontWeight + 100 :
    normalHeadingFontWeight
  );
  return {
    dividerHeight: '2px',
    labelEmFontSize,
    labelFontWeight,
    ...styleVarsProp
  };
}
