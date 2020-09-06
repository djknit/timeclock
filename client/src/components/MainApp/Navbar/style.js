import { headingFontFam, shadow, secondaryBackgroundColor, mainBackgroundColor } from '../style';

const textColor = '#ffffff';

export default function getStyle(brandItemInnerHeight, totalHeight) {
  return {
    nav: {
      backgroundColor: secondaryBackgroundColor,
      ...shadow(7, {})
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
    // navItem: {
    //   color: textColor
    // },
    dropdownArrow: {
      display: 'inline-block',
      position: 'relative',
      top: '.2em',
      fontSize: '.8em'
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

export { textColor };