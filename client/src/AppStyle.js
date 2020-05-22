const mainBackgroundColor = '#f6e653';
const secondaryBackgroundColor = '#A749D1';
const tertiaryColor = '#6141D1';
const quaternaryColor = '#B2D158';
const headingFontFam = 'Averia Serif Libre, Alice, IM Fell English, Overlock, serif, Times';
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
  footerHeight,
  shadow
};