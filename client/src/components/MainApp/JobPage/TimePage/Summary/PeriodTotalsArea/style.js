import { contentAreaTextLinkColors } from '../style';
export * from '../style';

function getArrowStylesForPseudoClassState(arrowPseudoClassState) {
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

export { getArrowStylesForPseudoClassState };
