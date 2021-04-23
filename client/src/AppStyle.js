import { isWindowWide } from './utilities';

// NEXT 2 COLORS ALSO DEFINED IN `App.css`. IF CHANGED, THEY MUST BE CHANGED BOTH PLACES!
const mainBackgroundColor = '#f6e653';
const secondaryBackgroundColor = '#6141D1';

// const tertiaryColor = '#A749D1';
// const quaternaryColor = '#B2D158';

const headingFontFam = 'Averia Serif Libre, Alice, IM Fell English, Overlock, serif, Times';
const sectionHeadingFontFam = 'Averia Serif Libre, IM Fell English, serif';
const footerHeight = 50;
const appMinWidth = 350;

const allExceptFooterMinHeight = `calc(100vh - ${footerHeight}px)`;

const bulmaFormBlue = '#3273dc';
const bulmaFormBlack = '#363636';

function getColorsObj(innate, hover, focus, active) {
  return { innate, hover, focus, active };
}
const dynamicBgColors = {
  success: getColorsObj(
    '#48c774', '#3ec46d', '#3abb67', '#48c774'
  ),
  danger: getColorsObj(
    '#f14668', '#f03a5f', '#df415b', '#ff4a6e'
  ),
  primary: getColorsObj(
    '#00d1b2', '#00c4a7', '#00b19a', '#00debd'
  ),
  info: getColorsObj(
    '#3298dc', '#2793da', '#2e8cca', '#35a1e9'
  ),
  infoLight: getColorsObj(
    '#eef6fc', '#e3f1fa', '#d3e0eb', '#eef6fc'
  ),
  primaryLight: getColorsObj(
    '#ebfffc', '#defffa', '#d1fcf8', '#ebfffc'
  ),
  light: getColorsObj(
    '#f5f5f5', '#eeeeee', '#e7e7e7', '#f8f8f8'
  )
};
const dangerBgColors = dynamicBgColors.danger;

function shadow(blur, offsetDirection, color, isInset) {
  if (blur === 0 || blur === null) {
    return { boxShadow: undefined };
  }
  const _blur = `${blur || 5}px`;
  const { x, y } = offsetDirection || {};
  const getOneDimensionalOffset = dimensionOffsetDirection => (
    dimensionOffsetDirection ?
    (dimensionOffsetDirection > 0 ? _blur : `-${_blur}`) :
    '0'
  );
  const _inset = isInset ? 'inset' : '';
  const xOffset = getOneDimensionalOffset(x);
  const yOffset = getOneDimensionalOffset(y);
  return { boxShadow: `${_inset} ${xOffset} ${yOffset} ${_blur} ${color || '#202020'}` };
};

function processsLength(rawLength) {
  return typeof(rawLength) === 'number' ? `${rawLength}px` : rawLength;
}

export default function getStyle() {
  return {
    wholeApp: {
      backgroundColor: mainBackgroundColor,
      minHeight: '100vh',
      minWidth: appMinWidth,
      textAlign: 'center'
    },
    allExceptFooter: {
      minHeight: allExceptFooterMinHeight,
      ...shadow(7),
      minWidth: '100%'
    }
  };
};

export {
  mainBackgroundColor,
  secondaryBackgroundColor,
  headingFontFam,
  sectionHeadingFontFam,
  footerHeight,
  allExceptFooterMinHeight,
  appMinWidth,
  bulmaFormBlue,
  bulmaFormBlack,
  dynamicBgColors,
  dangerBgColors,
  shadow,
  isWindowWide,
  processsLength
};
