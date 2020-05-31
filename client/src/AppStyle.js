 // NEXT 2 COLORS ALSO DEFINED IN `App.css`. IF CHANGED, THEY MUST BE CHANGED BOTH PLACES!
const mainBackgroundColor = '#f6e653';
const secondaryBackgroundColor = '#6141D1';

const tertiaryColor = '#A749D1';
const quaternaryColor = '#B2D158';
const headingFontFam = 'Averia Serif Libre, Alice, IM Fell English, Overlock, serif, Times';
const sectionHeadingFontFam = 'Averia Serif Libre, IM Fell English, serif';
const footerHeight = 50;

function shadow(blur, offsetDirection, color) {
  const _blur = `${blur || 5}px`;
  const { x, y } = offsetDirection || {};
  const getOneDimensionalOffset = dimensionOffsetDirection => (
    dimensionOffsetDirection ?
    (dimensionOffsetDirection > 0 ? _blur : `-${_blur}`) :
    '0'
  );
  const xOffset = getOneDimensionalOffset(x);
  const yOffset = getOneDimensionalOffset(y);
  return ({ boxShadow: `${xOffset} ${yOffset} ${_blur} ${color || '#202020'}` });
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
  shadow
};