import { dynamicBgColors, calculateStyleForPseudoClassState, shadow } from '../style';

export default function getStyle(theme, pseudoState) {

  let pseudoClassStyles = {
    hover: shadow(3),
    focus: shadow(3),
    active: shadow(null)
  };

  Object.keys(pseudoClassStyles).forEach(_pseudoClass => {
    if (!theme) return;
    pseudoClassStyles[_pseudoClass].backgroundColor = dynamicBgColors[theme][_pseudoClass];
  });

  return {
    tag: {
      outline: 'none',
      cursor: 'pointer',
      ...calculateStyleForPseudoClassState(pseudoClassStyles, pseudoState)
    }
  };
};
