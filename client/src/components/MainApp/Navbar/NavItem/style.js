import { calculateStyleForPseudoClassState } from '../../../higherOrder';
import { textColor, interactiveNavElVarStyles } from '../style';

export default function getStyle(pseudoState, isCurrentPage, additionalStyle) {

  return {
    navItem: {
      color: textColor,
      ...calculateStyleForPseudoClassState(interactiveNavElVarStyles, pseudoState),
      ...(isCurrentPage ? { fontStyle: 'italic' } : {}),
      ...additionalStyle
    }
  };
}