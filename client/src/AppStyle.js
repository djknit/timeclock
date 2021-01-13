import { isWindowWide } from './utilities';

// NEXT 2 COLORS ALSO DEFINED IN `App.css`. IF CHANGED, THEY MUST BE CHANGED BOTH PLACES!
const mainBackgroundColor = '#f6e653';
const secondaryBackgroundColor = '#6141D1';

const tertiaryColor = '#A749D1';
const quaternaryColor = '#B2D158';

const headingFontFam = 'Averia Serif Libre, Alice, IM Fell English, Overlock, serif, Times';
const sectionHeadingFontFam = 'Averia Serif Libre, IM Fell English, serif';
const footerHeight = 50;

const bulmaFormBlue = '#3273dc';
const bulmaFormBlack = '#363636';

const dangerBgColors = {
  innate: '#f14668', // matches Bulma
  hover: '#f03a5f', // matches Bulma
  focus: '#df415b',
  active: '#ff4a6e'
};

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

export default function getStyle() {
  return {
    wholeApp: {
      backgroundColor: mainBackgroundColor,
      minHeight: '100vh',
      minWidth: 350,
      textAlign: 'center'
    },
    allExceptFooter: {
      minHeight: `calc(100vh - ${footerHeight}px)`,
      ...shadow(7)
    }
  };
};

export {
  mainBackgroundColor,
  secondaryBackgroundColor,
  headingFontFam,
  sectionHeadingFontFam,
  footerHeight,
  bulmaFormBlue,
  bulmaFormBlack,
  dangerBgColors,
  shadow,
  isWindowWide
};
