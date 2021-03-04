import { dynamicBgColors, calculateStyleForPseudoClassState } from '../style';

export default function getStyle(theme, pseudoState, styleProp) {

  let pseudoClassStyles = {}, pseudoClassNames = ['hover', 'focus', 'active'];

  for (const pseudoClass of pseudoClassNames) {
    if (!theme) return;
    pseudoClassStyles[pseudoClass] = {
      backgroundColor: dynamicBgColors[theme][pseudoClass]
    };
  };

  return {
    tag: {
      ...calculateStyleForPseudoClassState(pseudoClassStyles, pseudoState),
      ...styleProp
    }
  };
};
