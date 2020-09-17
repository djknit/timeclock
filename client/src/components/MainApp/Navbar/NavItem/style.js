import { calculateStyleForPseudoClassState } from '../../../higherOrder';
import { textColor, interactiveNavElVarStyles } from '../style';

export default function getStyle(pseudoState, additionalStyle) {

  return {
    navItem: {
      color: textColor,
      ...calculateStyleForPseudoClassState(interactiveNavElVarStyles, pseudoState),
      ...(additionalStyle || {})
    }
  };
}