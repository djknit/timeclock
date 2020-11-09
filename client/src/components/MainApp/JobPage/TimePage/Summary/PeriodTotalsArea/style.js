import {
  getInfoItemAreaStyles, contentAreaBgColor, contentAreaDividerColor, contentAreaTextLinkColors
} from '../style';

const defaultItemAreaStyles = getInfoItemAreaStyles();

export default function getStyle(contentToggleStyles, togglerArrowPseudoState) {

  const labelEmFontSize = 1.15;
  const arrowFontSize = '1.6rem';

  return {
    area: {
      position: 'relative',
      textAlign: 'left',
      padding: '.01px 0'
    },
    areaLabel: {
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 1,
      backgroundColor: contentAreaBgColor,
      paddingRight: 10,
      textAlign: 'left',
      fontSize: `${labelEmFontSize}em`,
      fontWeight: 'bold'
    },
    labelHr: {
      height: 1,
      // position: 'absolute',
      width: '100%',
      // margin: 0,
      marginTop: `${.5 * 1.5 * labelEmFontSize}em`,
      marginBottom: `calc(${.5 * 1.5 * labelEmFontSize}em - 1px)`,
      // top: `${.5 * 1.5 * labelEmFontSize}em`,
      backgroundColor: contentAreaDividerColor
    },
    areaBody: {
      ...contentToggleStyles.container
    },
    footerHr: {
      height: 1,
      backgroundColor: contentAreaDividerColor,
      width: `calc(100% - 10px - ${arrowFontSize})`,
      marginTop: `calc(.6 * ${arrowFontSize} - 1px)`,
      marginBottom: `calc(.4 * ${arrowFontSize})`,
    },
    togglerArrow: {
      ...contentToggleStyles.toggle,
      position: 'absolute',
      right: 0,
      bottom: 0,
      fontSize: arrowFontSize,
      lineHeight: 1,
      color: getArrowColor(togglerArrowPseudoState),
      outline: 'none',
      textDecoration: togglerArrowPseudoState.isFocused ? 'underline' : 'none'
    }
  };
};

function getArrowColor(arrowPseudoClassState) {
  return (
    (arrowPseudoClassState.isActive && contentAreaTextLinkColors.active) ||
    (arrowPseudoClassState.isFocused && contentAreaTextLinkColors.focus) ||
    (arrowPseudoClassState.isHovered && contentAreaTextLinkColors.hover) ||
    contentAreaTextLinkColors.innate
  );
}