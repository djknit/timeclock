import { headingFontFam, allExceptFooterMinHeight, appMinWidth } from '../../../AppStyle';

const innerContainerPaddingTop = 20;
const logoMaxPxHeight = 350;
const imgWidthToHeightRatio = 622 / 350; // depends on image dimensions

const outerContainerMinHeight = (
  `calc((0.9 * ${allExceptFooterMinHeight}) - ${2 * innerContainerPaddingTop}px)`
);

let mobileButtonStyle = {
  height: 'auto',
  lineHeight: 1
};
mobileButtonStyle.paddingTop = mobileButtonStyle.paddingBottom = '0.5em';
mobileButtonStyle.paddingLeft = mobileButtonStyle.paddingRight = '0.75em';

export default function getStyle(windowWidth) {

  let buttonStyle = { margin: '8px' };
  if (windowWidth < 408) Object.assign(buttonStyle, mobileButtonStyle);

  return {
    outerContainer: {
      display: 'table-cell',
      verticalAlign: 'middle',
      textAlign: 'center',
      minWidth: appMinWidth,
      width: '100vw',
      minHeight: outerContainerMinHeight,
      height: outerContainerMinHeight
    },
    innerContainer: {
      width: '100%',
      display: 'inline-block',
      paddingTop: 20
    },
    heading: {
      fontSize: getHeadingFontSize(windowWidth),
      fontFamily: headingFontFam,
      color: '#303030',
      fontWeight: 'bold'
    },
    logo: {
      maxWidth: '100%',
      maxHeight: logoMaxPxHeight
    },
    buttonsArea: {
      maxWidth: logoMaxPxHeight * imgWidthToHeightRatio,
      margin: 'auto',
      display: 'flex',
      justifyContent: 'space-evenly'
    },
    leftButton: buttonStyle,
    rightButton: buttonStyle
  };
};


function getHeadingFontSize(windowWidth) { // created to replicate original val "calc(36px + 4vw)" but w/ max value 80px
  const pxContribution = 36, vwContribution = 5, maxPxVal = 80;
  return windowWidth ? (
    Math.min(
      pxContribution + (vwContribution * (windowWidth / 100)),
      maxPxVal
    )
  ) : (
    `calc(${pxContribution}px + ${vwContribution}vw)`
  );
}
