import { dashContentBtnSpecs } from '../style';

export default function getStyle(additionalStyle) {
  
  const dividerColor = '#b3b3b3';

  return {
    contentArea: {
      ...additionalStyle
    },
    infoText: {
      marginBottom: '.5em',
      padding: '.5em .75em 1em',
      textAlign: 'left',
      borderBottom: `solid 1px ${dividerColor}`
    },
    buttonArea: {
      padding: '.5em 0 0',
      // borderTop: `solid 1px ${dividerColor}`,
      textAlign: 'right'
    },
    button: {
      innate: {
        padding: `${dashContentBtnSpecs.yPadding}px ${dashContentBtnSpecs.xPadding}px`,
        fontSize: `${dashContentBtnSpecs.remFontSize}rem`,
        lineHeight: dashContentBtnSpecs.lineHeight,
        height: 'auto',
        // marginTop: '.5em'
      }
    },
    hr: {
      margin: '1em',
      height: 1,
      backgroundColor: '#a0a0a0'
    }
  };
};