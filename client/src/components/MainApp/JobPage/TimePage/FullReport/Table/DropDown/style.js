import { getArrowStylesForPseudoClassState } from '../style';

export default function getStyle(togglerPseudoState, toggleStyles) {
  
  const arrowWidth = '1em';
  const arrowMarginLeft = '2px';
  
  return {
    togglerArrow: {
      ...toggleStyles.toggle,
      width: arrowWidth,
      marginLeft: arrowMarginLeft,
      verticalAlign: 'bottom',
      ...getArrowStylesForPseudoClassState(togglerPseudoState),
      textAlign: 'center'
    },
    dropdownContainer: {
      display: 'block',
      ...toggleStyles.container,
      paddingRight: `calc(${arrowWidth} + ${arrowMarginLeft})`
    }
  };
};
