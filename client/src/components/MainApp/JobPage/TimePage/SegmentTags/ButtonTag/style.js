import { dynamicBgColors, calculateStyleForPseudoClassState, shadow } from '../../style';

export default function getStyle(theme, pseudoState) {

  const _tagNonInnateStyle = _shadowBlur => ({
    position: 'relative',
    zIndex: 1,
    ...shadow(_shadowBlur)
  });

  let pseudoClassStyles = {
    hover: _tagNonInnateStyle(3),
    focus: _tagNonInnateStyle(3),
    active: _tagNonInnateStyle(null)
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
