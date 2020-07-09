import {
  contentAreaDividerColor as dividerColor, dashContentBtnSpecs, contentAreaPadding, getInfoItemAreaStyles
} from '../style';

export default function getStyle(additionalStyle) {
  
  // const accountPropArea = {
  //   paddingLeft: '.75em',
  //   paddingRight: '.75em',
  //   paddingTop: 0,
  //   textAlign: 'right'
  // };

  // const propAreaBottomPadding = '1.25em';

  // const adjustedBtnSpecs = adjustBtnSpecs(dashContentBtnSpecs, 1.3);
  // const buttonInnateStyle = {
  //   padding: `${adjustedBtnSpecs.yPadding}px ${adjustedBtnSpecs.xPadding}px`,
  //   fontSize: `${adjustedBtnSpecs.remFontSize}rem`,
  //   lineHeight: adjustedBtnSpecs.lineHeight,
  //   height: 'auto'
  // };

  const accountPropAreaStyles = getInfoItemAreaStyles(undefined, undefined, undefined, undefined, 1.3);

  return {
    contentArea: {
      ...additionalStyle
    },
    accountPropAreaNotLast: accountPropAreaStyles.areaNotLastHasBtns,
    // accountPropAreaNotLast: {
    //   ...accountPropArea,
    //   paddingBottom: propAreaBottomPadding,
    //   borderBottom: `solid 1px ${dividerColor}`,
    //   marginBottom: '.5em'
    // },
    lastAccountPropArea: accountPropAreaStyles.lastAreaHasBtns,
    // lastAccountPropArea: {
    //   ...accountPropArea,
    //   paddingBottom: `calc(${propAreaBottomPadding} - ${contentAreaPadding}px)`
    // },
    propAreaText: accountPropAreaStyles.areaHasBtnsText,
    // propAreaText: {
    //   padding: '.5em 0 .75em',
    //   textAlign: 'left'
    // },
    button: accountPropAreaStyles.firstBtn,
    // button: {
    //   innate: {
    //     ...buttonInnateStyle
    //   }
    // },
    buttonNotFirst: accountPropAreaStyles.btnNotFirst,
    // buttonNotFirst: {
    //   innate: {
    //     ...buttonInnateStyle,
    //     marginLeft: '.5em'
    //   }
    // },
    // hr: {
    //   margin: '1em',
    //   height: 1,
    //   backgroundColor: '#b3b3b3'
    // }
  };
};

// function adjustBtnSpecs(unadjustedSpecs, targetRemFontSize) {
//   const adjustmentFactor = targetRemFontSize / unadjustedSpecs.remFontSize;
//   return {
//     remFontSize: targetRemFontSize,
//     xPadding: unadjustedSpecs.xPadding * adjustmentFactor,
//     yPadding: unadjustedSpecs.yPadding * adjustmentFactor,
//     lineHeight: unadjustedSpecs.lineHeight
//   };
// }