import { shadow, getDynamicBgStylesForTheme } from '../style';
import { calculateStyleForPseudoClassState } from '../higherOrder';
export * from '../../AppStyle';

export default function getStyle(
  additionalStyles, pseudoClassState, colorTheme, styleProp, shadowBlurRatio = 1
) {
  const { isActive, isFocused } = pseudoClassState || {};
  const shadowBlur = shadowBlurRatio * ((isActive && 3) || (isFocused && 9) || 7);

  const backgroundColorStyles = getDynamicBgStylesForTheme(colorTheme);

  return {
    button: {
      ...shadow(shadowBlur, undefined, '#000000'),
      display: 'inline-block',
      ...calculateStyleForPseudoClassState(backgroundColorStyles, pseudoClassState),
      ...styleProp,
      ...calculateStyleForPseudoClassState(additionalStyles, pseudoClassState)
    }
  };
};
