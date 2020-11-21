import { contentAreaTextLinkColors } from '../style';

export default function getStyle(arrowPseudoClassState) {
  return {
    arrow: _getArrowStylesForPseudoClass(arrowPseudoClassState)
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
