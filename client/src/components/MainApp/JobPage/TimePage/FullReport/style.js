import { contentAreaDividerColor } from '../style';
export * from '../style';

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

export default function getStyle(styleProp) {

  const borderStyle = `3.4px solid ${contentAreaDividerColor}`;

  return {
    wholeReport: {
      borderTop: borderStyle,
      borderBottom: borderStyle,
      ...styleProp
    },
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
