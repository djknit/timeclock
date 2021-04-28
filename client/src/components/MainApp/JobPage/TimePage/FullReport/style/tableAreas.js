import { contentAreaPadding } from '../style';

const _bLevelXPadding = 20;
const widthVars = {
  bLevelAreaLeftPxPadding: _bLevelXPadding,
  bLevelAreaRightPxPadding: _bLevelXPadding,
  tableLeftPxMargin: 20,
  tableRightPxMargin: 0
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

const topEmFs = 1.32, _2ndEmFs = 1.1, lrgFsWt = 0.3; // lrgFsWt is wt. (in [0, 1]) for top level in weighted avg. heading font-size
const {
  vars: topLevelAreaHeaderStyleVars,
  style: topLevelAreaHeaderStyle
} = getHeaderStyleAndVars(topEmFs, '2.6px');
const {
  vars: secondLevelHeaderStyleVars,
  style: secondLevelHeaderStyle
} = getHeaderStyleAndVars(_2ndEmFs);
const {
  vars: secondLevelTotalsHeaderStyleVars,
  style: secondLevelTotalsHeaderStyle
} = getHeaderStyleAndVars((lrgFsWt * topEmFs) + ((1 - lrgFsWt) * _2ndEmFs));

export {
  tableAreaStyleVars,
  topLevelAreaHeaderStyle,
  topLevelAreaHeaderStyleVars,
  secondLevelHeaderStyle,
  secondLevelHeaderStyleVars,
  secondLevelTotalsHeaderStyle,
  secondLevelTotalsHeaderStyleVars
};


function getSumOfArray(arr = [0]) {
  return arr.reduce((a, b) => (a || 0) + (b || 0));
}
