import { shadow, dynamicBgColors } from '../../AppStyle';
import { calculateStyleForPseudoClassState } from '../higherOrder';
export * from '../../AppStyle';

export default function getStyle(
  additionalStyles, pseudoClassState, colorTheme, styleProp, shadowBlurRatio = 1
) {
  const { isActive, isFocused } = pseudoClassState || {};
  const shadowBlur = shadowBlurRatio * ((isActive && 3) || (isFocused && 9) || 7);

  const backgroundColorStyles = getBackgroundColorStyles(colorTheme);

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


function getBackgroundColorStyles(colorTheme = '') {
  let processedTheme;
  const themeWords = colorTheme.split(' ');
  let i = -1;
  while (!processedTheme && ++i < themeWords.length) {
    if (themeWords[i] !== 'light') processedTheme = themeWords[i];
  }
  if (colorTheme.includes('light') && themeWords.length > 1) processedTheme += 'Light';
  let dynamicBgColorsForTheme = dynamicBgColors[processedTheme || 'light'];
  let bgColorStyles = {};
  for (const pseudoClass in dynamicBgColorsForTheme) {
    bgColorStyles[pseudoClass] = { backgroundColor: dynamicBgColorsForTheme[pseudoClass] };
  }
  return bgColorStyles;
}