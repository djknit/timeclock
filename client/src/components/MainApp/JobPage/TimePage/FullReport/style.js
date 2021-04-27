import { contentAreaDividerColor, contentAreaPadding } from '../style';
export * from '../style';

/*
NOTE: the element containing this component must be positioned all styles to work
*/

const tableAreaStyleVars = {
  bLevelAreaLeftPxPadding: 20,
  marginBetweenAreas: '1.5rem',
  tableLeftPxMargin: 20,
  tableRightPxMargin: 0
};

const getHeaderStyleAndStyleVars = (containerEmFontSize, dividerHeight) => ({
  vars: { dividerHeight, containerEmFontSize, lineHeight: 1 },
  style: { fontSize: `${containerEmFontSize}em` }
});
const topLevelHeaderEmFontSize = 1.32, secondLevelHeaderEmFontSize = 1.1;
const {
  vars: topLevelAreaHeaderStyleVars,
  style: topLevelAreaHeaderStyle
} = getHeaderStyleAndStyleVars(topLevelHeaderEmFontSize, '2.6px');
const {
  vars: secondLevelHeaderStyleVars,
  style: secondLevelHeaderStyle
} = getHeaderStyleAndStyleVars(secondLevelHeaderEmFontSize);
const {
  vars: secondLevelTotalsHeaderStyleVars,
  style: secondLevelTotalsHeaderStyle
} = getHeaderStyleAndStyleVars((topLevelHeaderEmFontSize + 2 * secondLevelHeaderEmFontSize) / 3);

export default function getStyle(styleProp, widths) {

  const borderStyle = `3.4px solid ${contentAreaDividerColor}`;

  let wholeReport = {
    borderTop: borderStyle,
    borderBottom: borderStyle,
  };

  if (!widths) {
    Object.assign(wholeReport, {
      display: 'inline-block',
      position: 'absolute',
      left: contentAreaPadding,
      minWidth: `calc(100% - ${2 * contentAreaPadding})`
    });
  }

  Object.assign(wholeReport, styleProp);

  return {
    wholeReport,
    reportTitle: {
      margin: '0.5em 0'
    }
  };
};

export {
  tableAreaStyleVars,
  topLevelAreaHeaderStyle,
  topLevelAreaHeaderStyleVars,
  secondLevelHeaderStyle,
  secondLevelHeaderStyleVars,
  secondLevelTotalsHeaderStyle,
  secondLevelTotalsHeaderStyleVars
};
