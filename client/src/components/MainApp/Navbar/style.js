import { headingFontFam, shadow, secondaryBackgroundColor, mainBackgroundColor } from '../style';

const textColor = '#ffffff';
const backgroundColor = secondaryBackgroundColor;

const navShadow = shadow(7);
const depressedItemShadow = shadow(2, undefined, undefined, true);

export default function getStyle(brandItemInnerHeight, totalHeight) {
  const overflowingText = {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  };

  return {
    nav: {
      backgroundColor,
      ...navShadow
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
      ...overflowingText,
      maxWidth: 148
    },
    currentJobLabel: {
      ...overflowingText,
      maxWidth: 140
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

export { textColor, backgroundColor, navShadow, depressedItemShadow };