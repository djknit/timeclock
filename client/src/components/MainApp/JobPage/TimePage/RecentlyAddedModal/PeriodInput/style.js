export default function getStyle() {

  const arrowXPadding = '0.5em';

  return {
    mainSelect: {
      textAlign: 'center'
    },
    label: {
      textAlign: 'left'
    },
    arrow: {
      display: 'inline-block',
      ...calculateArrowHeightStyles(1.5),
      paddingLeft: arrowXPadding,
      paddingRight: arrowXPadding
    },
    customNumInput: {
      textAlign: 'right',
      width: '4em',
      marginRight: '0.5em'
    },
    customUnitInput: {
      
    }
  };
};


// ABOUT NEXT FUCNTION: adjusts Bulma `.input` styles for bigger font size w/ same total element height so arrow sits inline w/ the inputs
function calculateArrowHeightStyles(remFontSize = 1) { // Bulma `.input` `fontSize` is `1rem`.
  const emHeight = 2.5 / remFontSize;
  const yPadding = `${(emHeight - 1) / 2}em`; // (for `lineHeight: 1`)
  return {
    fontSize: `${remFontSize}rem`,
    verticalAlign: 'top',
    height: `${emHeight}em`,
    paddingTop: yPadding,
    paddingBottom: yPadding,
    lineHeight: 1
  };
}
