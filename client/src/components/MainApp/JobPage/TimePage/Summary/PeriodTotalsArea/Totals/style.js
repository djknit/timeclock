import { getArrowStylesForPseudoClassState } from '../style';

export default function getStyle(arrowPseudoState) {
  return {
    earningsDetails: {
      paddingLeft: '0.5rem'
    },
    detailsTogglerArrow: {
      ...getArrowStylesForPseudoClassState(arrowPseudoState)
    }
  };
};
