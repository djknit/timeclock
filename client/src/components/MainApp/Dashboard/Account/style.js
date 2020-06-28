import { dashContentBtnSpecs, contentAreaPadding } from '../style';

export default function getStyle(additionalStyle) {
  
  const dividerColor = '#b3b3b3';

  const accountPropArea = {
    paddingLeft: '.75em',
    paddingRight: '.75em',
    paddingTop: 0,
    textAlign: 'right'
  };

  const propAreaBottomPadding = '1.25em';

  const adjustedBtnSpecs = adjustBtnSpecs(dashContentBtnSpecs, 1.3);
  const buttonInnateStyle = {
    padding: `${adjustedBtnSpecs.yPadding}px ${adjustedBtnSpecs.xPadding}px`,
    fontSize: `${adjustedBtnSpecs.remFontSize}rem`,
    lineHeight: adjustedBtnSpecs.lineHeight,
    height: 'auto'
  };

  return {
    contentArea: {
      ...additionalStyle
    },
    accountPropAreaNotLast: {
      ...accountPropArea,
      paddingBottom: propAreaBottomPadding,
      borderBottom: `solid 1px ${dividerColor}`,
      marginBottom: '.5em'
    },
    lastAccountPropArea: {
      ...accountPropArea,
      paddingBottom: `calc(${propAreaBottomPadding} - ${contentAreaPadding}px)`
    },
    propAreaText: {
      padding: '.5em 0 .75em',
      textAlign: 'left'
    },
    button: {
      innate: {
        ...buttonInnateStyle
      }
    },
    buttonNotFirst: {
      innate: {
        ...buttonInnateStyle,
        marginLeft: '.5em'
      }
    },
    hr: {
      margin: '1em',
      height: 1,
      backgroundColor: '#a0a0a0'
    }
  };
};

function adjustBtnSpecs(unadjustedSpecs, targetRemFontSize) {
  const adjustmentFactor = targetRemFontSize / unadjustedSpecs.remFontSize;
  return {
    remFontSize: targetRemFontSize,
    xPadding: unadjustedSpecs.xPadding * adjustmentFactor,
    yPadding: unadjustedSpecs.yPadding * adjustmentFactor,
    lineHeight: unadjustedSpecs.lineHeight
  };
}