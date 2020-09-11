import { calculateStyleForPseudoClassState } from '../../../higherOrder';
import { textColor, shadow } from '../style';

export default function getStyle(pseudoState, additionalStyle) {

  const variableStyles = {
    innate: {
      color: textColor,
      backgroundColor: 'transparent'
    },
    hover: {
      color: '#fafafa',
      backgroundColor: 'rgba(0, 0, 0, .07)'
    },
    focus: {
      color: '#f7f7f7',
      backgroundColor: 'rgba(0, 0, 0, .09)'
    },
    active: {
      color: textColor,
      backgroundColor: 'rgba(255, 255, 255, .07)',
      ...shadow(2, undefined, undefined, true)
    }
  };

  return {
    navItem: {
      color: textColor,
      ...calculateStyleForPseudoClassState(variableStyles, pseudoState),
      ...(additionalStyle || {})
    }
  };
}