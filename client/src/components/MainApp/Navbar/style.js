import { headingFontFam, shadow, secondaryBackgroundColor, mainBackgroundColor } from '../style';

const textColor = '#ffffff';
const backgroundColor = secondaryBackgroundColor;

export default function getStyle(brandItemInnerHeight, totalHeight) {
  const overflowingText = {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  };

  return {
    nav: {
      backgroundColor,
      ...shadow(7, {})
    },
    menu: {
      backgroundColor
    },
    brandTextItem: {
      paddingLeft: 2
    },
    brandText: {
      display: 'inline-block',
      height: '100%',
      fontFamily: headingFontFam,
      fontSize: brandItemInnerHeight && (brandItemInnerHeight / 2),
      lineHeight: 1,
      textAlign: 'left',
      color: textColor
    },
    brandImgItem: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingRight: 0
    }, 
    brandImg: {
      height: totalHeight,
      maxHeight: totalHeight,
      width: totalHeight
    },
    jobsDropdownItem: {
      paddingRight: 16
    },
    jobLabel: {
      ...overflowingText
    },
    currentJobLabel: {
      ...overflowingText
    },
    settingLabel: {
      paddingLeft: 28
    },
    burger: {
      color: textColor
    },
    welcomeText: {
      color: textColor
    },
    logoutButton: {
      innate: { marginLeft: 10 }
    }
  };
};

export { textColor, backgroundColor, shadow };