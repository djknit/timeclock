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
  const getResult = (
    (focusBgColor, activeBgColor) => ({
      focus: { backgroundColor: focusBgColor },
      active: { backgroundColor: activeBgColor }
    })
  );
  switch (colorTheme) {
    case 'primary':
      return getResult('#00b19a', '#00debd');
    case 'danger':
      return getResult('#df415b', '#ff4a6e');
    default: // = 'light'
      return getResult('#e7e7e7', '#f8f8f8');
  }
/*
  COLORS:
    danger
      innert: #f14668  =  241, 70, 104
      hover: #f03a5f  =  240, 58, 95
      focus: #df415b  =  223, 65, 91
      active: #ff4a6e  =  255, 74, 110

    primary
      innert: #00d1b2  =  0, 209, 178
      hover: #00c4a7  =  0, 196, 167
      focus: #00b19a  =  0, 193, 155
      active: #00debd  =  0, 222, 189

    info
      innert:
      hover:
      focus:
      active:
*/
}