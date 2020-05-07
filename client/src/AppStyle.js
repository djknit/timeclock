const mainBackgroundColor = '#f6e653';
const headingFontFam = 'Averia Serif Libre, Alice, IM Fell English, Overlock, serif, Times';
const footerHeight = 50;

export default function getStyle() {
  return {
    wholeApp: {
      backgroundColor: mainBackgroundColor,
      minHeight: '100vh',
      textAlign: 'center'
    },
    allExceptFooter: {
      minHeight: `calc(100vh - ${footerHeight}px)`
    }
  };
};

export {
  headingFontFam,
  footerHeight
};