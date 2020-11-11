import { contentAreaDividerColor, contentAreaTextLinkColors } from '../style';

export default function getStyle(contentToggleStyles, togglerArrowPseudoState) {

  const arrowFontSize = '1.6rem';
  const arrowXPadding = `calc(0.15 * ${arrowFontSize})`;

  return {
    div: {
      position: 'relative',
      // paddingTop: `calc(0.6 * ${arrowFontSize} - 1px)`,
      paddingBottom: `calc(0.4 * ${arrowFontSize})`
    },
    footerHr: {
      height: 1,
      backgroundColor: contentAreaDividerColor,
      width: `calc(100% - 10px - ${arrowFontSize})`,
      margin: 0
      // marginTop: `calc(0.6 * ${arrowFontSize} - 1px)`,
      // marginBottom: `calc(0.4 * ${arrowFontSize})`
    },
    togglerArrow: {
      ...contentToggleStyles.toggle,
      position: 'absolute',
      padding: `0 ${arrowXPadding}`,
      right: `calc(-1 * ${arrowXPadding})`,
      bottom: 0,
      fontSize: arrowFontSize,
      lineHeight: 1,
      ..._getArrowStylesForPseudoClass(togglerArrowPseudoState)
    }
  };
};

function _getArrowStylesForPseudoClass(arrowPseudoClassState) {
  const { isActive, isFocused, isHovered, isTabFocused } = arrowPseudoClassState;
  return {
    color: (
      (isActive && contentAreaTextLinkColors.active) ||
      ((isFocused || isTabFocused) && contentAreaTextLinkColors.focus) ||
      (isHovered && contentAreaTextLinkColors.hover) ||
      contentAreaTextLinkColors.innate
    ),
    outline: isTabFocused ? `${contentAreaTextLinkColors.focus} solid 1.5px` : 'none',
    fontWeight: (isActive || isFocused || isHovered || isTabFocused) ? 1000 : 900
  };
}