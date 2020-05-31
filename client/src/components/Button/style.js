import { shadow } from '../../AppStyle';
import { calculateStyleForPseudoClassState } from '../higherOrder';

export default function getStyle(additionalStyles, pseudoClassState, colorTheme) {
  const { isActive, isFocused } = pseudoClassState || {};
  const shadowBlur = (isActive && 3) || (isFocused && 9) || 7;

  const backgroundColorStyles = getBackgroundColorStyles(colorTheme);

  return {
    button: {
      ...shadow(shadowBlur, undefined, '#000000'),
      display: 'inline-block',
      ...calculateStyleForPseudoClassState(backgroundColorStyles, pseudoClassState),
      ...calculateStyleForPseudoClassState(additionalStyles, pseudoClassState)
    }
  };
};

export * from '../../AppStyle';

function getBackgroundColorStyles(colorTheme) {
  if (!colorTheme || colorTheme === 'light') {
    return {
      focus: {
        backgroundColor: '#e7e7e7'
      },
      active: {
        backgroundColor: '#f8f8f8'
      }
    };
  }
  if (colorTheme === 'primary') {
    return {
      focus: {
        backgroundColor: '#00b19a'
      },
      active: {
        backgroundColor: '#00debd'
      }
    };
  }
  return {};
}