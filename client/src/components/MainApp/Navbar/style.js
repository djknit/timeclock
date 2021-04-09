import { isWindowWide } from '../utilities';
import { calculateStyleForPseudoClassState } from '../../higherOrder';
import { headingFontFam, shadow, secondaryBackgroundColor } from '../style';

const textColor = '#ffffff';
const backgroundColor = secondaryBackgroundColor;

const navShadow = shadow(7);
const depressedItemShadow = shadow(2, undefined, undefined, true);

const _navElFocusStyle = {
  color: '#f7f7f7',
  backgroundColor: 'rgba(0, 0, 0, .09)'
};
const interactiveNavElVarStyles = {
  innate: {
    color: textColor,
    backgroundColor: 'transparent'
  },
  hover: {
    color: '#fafafa',
    backgroundColor: 'rgba(0, 0, 0, .07)'
  },
  focus: _navElFocusStyle,
  active: {
    color: textColor,
    backgroundColor: 'rgba(255, 255, 255, .07)',
    ...depressedItemShadow
  },
  tabFocus: {
    ..._navElFocusStyle,
    outline: `solid 1px ${_navElFocusStyle.color}`
  }
};

// * * * 
  /*
TO DO:

  Figure out why dropdowns && navitems are so wide now!

*/

export default function getStyle(brandItemInnerHeight, totalHeight, burgerPseudoState, windowWidth) {
  const overflowingText = {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    // display: 'inline-block'
  };
  
  const jobLabelMaxWidth = '148px';
  const currentJobLabelMaxWidth = '140px';
  console.log('windowWidth\n', windowWidth)
  console.log('isWindowWide\n', isWindowWide(windowWidth))

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
      maxWidth: isWindowWide(windowWidth) ? `min(${jobLabelMaxWidth}, 100%)` : '100%'
    },
    currentJobLabel: {
      ...overflowingText,
      maxWidth: isWindowWide(windowWidth) ? `min(${currentJobLabelMaxWidth}, 100%)` : '100%'
    },
    settingLabel: {
      paddingLeft: 28
    },
    burger: {
      color: textColor,
      ...calculateStyleForPseudoClassState(interactiveNavElVarStyles, burgerPseudoState)
    },
    welcomeText: {
      color: textColor
    },
    logoutButton: {
      innate: { marginLeft: 10 }
    }
  };
};

export { textColor, backgroundColor, navShadow, depressedItemShadow, interactiveNavElVarStyles };