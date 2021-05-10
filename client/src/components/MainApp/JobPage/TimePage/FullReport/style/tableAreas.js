import { contentAreaPadding } from '../style';

const _bLevelXPadding = 20;
const widthVars = {
  bLevelAreaLeftPxPadding: _bLevelXPadding,
  bLevelAreaRightPxPadding: _bLevelXPadding,
  tableLeftPxMargin: 20,
  tableRightPxMargin: 10
}
const allUnusableWidths = [...Object.values(widthVars), (2 * contentAreaPadding)];

const tableAreaStyleVars = {
  ...widthVars,
  marginBetweenAreas: '1.5rem',
  pxWidthUnavailableToTables: getSumOfArray(allUnusableWidths)
};

const getHeaderStyleAndVars = (containerEmFontSize, dividerHeight) => ({
  vars: { dividerHeight, containerEmFontSize, lineHeight: 1 },
  style: { fontSize: `${containerEmFontSize}em` }
});

const topLvlHeaderEmFontSize = 1.32, _2ndLvlHeadEmFs = 1.1;
const {
  vars: topLevelAreaHeaderStyleVars,
  style: topLevelAreaHeaderStyle
} = getHeaderStyleAndVars(topLvlHeaderEmFontSize, '4px');
const {
  vars: secondLevelHeaderStyleVars,
  style: secondLevelHeaderStyle
} = getHeaderStyleAndVars(_2ndLvlHeadEmFs, '2px');

const lrgFsWt = 0.3; // `lrgFsWt` is weight (in [0, 1]) given to top level fs in weighted avg. heading font-size calc
const _2ndLvlTotalsHeadEmFs = (lrgFsWt * topLvlHeaderEmFontSize) + ((1 - lrgFsWt) * _2ndLvlHeadEmFs);
const _2ndLvlHeaderFsTotalsToRegRatio = _2ndLvlTotalsHeadEmFs / _2ndLvlHeadEmFs;
const {
  vars: topLevelTotalsHeaderStyleVars,
  style: topLevelTotalsHeaderStyle
} = getHeaderStyleAndVars(_2ndLvlHeaderFsTotalsToRegRatio * topLvlHeaderEmFontSize, '4.4px');
const {
  vars: secondLevelTotalsHeaderStyleVars,
  style: secondLevelTotalsHeaderStyle
} = getHeaderStyleAndVars(_2ndLvlTotalsHeadEmFs, '2.8px');

const largestDividerHeight = topLevelTotalsHeaderStyleVars.dividerHeight;

export {
  tableAreaStyleVars,
  topLevelAreaHeaderStyle,
  topLevelAreaHeaderStyleVars,
  topLevelTotalsHeaderStyle,
  topLevelTotalsHeaderStyleVars,
  secondLevelHeaderStyle,
  secondLevelHeaderStyleVars,
  secondLevelTotalsHeaderStyle,
  secondLevelTotalsHeaderStyleVars,
  largestDividerHeight
};


function getSumOfArray(arr = [0]) {
  return arr.reduce((a, b) => (a || 0) + (b || 0));
}
