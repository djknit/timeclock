import { calculateStyleForPseudoClassState } from '../../../../../../higherOrder';
import { dangerBgColors, shadow } from '../../../../../../../AppStyle';

export default function getStyle(deleteTagPseudoState) {
  
  const deleteTagStyles = {
    hover: {
      ...shadow(3)
    },
    focus: {
      ...shadow(3)
    },
    active: {
      ...shadow(null)
    }
  };

  Object.keys(deleteTagStyles).forEach(styleName => {
    deleteTagStyles[styleName].backgroundColor = dangerBgColors[styleName];
  });

  return {
    deleteTag: {
      ...calculateStyleForPseudoClassState(deleteTagStyles, deleteTagPseudoState),
      cursor: 'pointer'
    }
  };
};
