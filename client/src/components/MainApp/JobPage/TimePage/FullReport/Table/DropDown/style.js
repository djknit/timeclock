import { getArrowStylesForPseudoClassState } from '../style';

export default function getStyle(togglerPseudoState, toggleStyles) {
  
  const arrowWidth = '1em';
  
  return {
    togglerArrow: {
      ...toggleStyles.toggle,
      width: arrowWidth,
      verticalAlign: 'bottom',
      ...getArrowStylesForPseudoClassState(togglerPseudoState)
    },
    dropdownContainer: {
      display: 'block',
      ...toggleStyles.container,
      paddingRight: arrowWidth
    }
  };
};
