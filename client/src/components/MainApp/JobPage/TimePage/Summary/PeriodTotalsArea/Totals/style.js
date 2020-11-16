import { getArrowStylesForPseudoClassState, togglerArrowsEmXPadding } from '../style';

export default function getStyle(arrowPseudoState) {
  return {
    earningsDetails: {
      paddingLeft: '0.5rem'
    },
    detailsTogglerArrow: {
      padding: `0 ${togglerArrowsEmXPadding}em`,
      ...getArrowStylesForPseudoClassState(arrowPseudoState)
    }
  };
};
