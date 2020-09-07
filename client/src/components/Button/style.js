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
    case 'info':
      return getResult('#2e8cca', '#35a1e9');
    case 'success':
      return getResult('#42b76b', '#4cd37b');
    case 'warning':
      return getResult('#e5c74e', '#ffea5c');
    default: // = 'light'
      return getResult('#e7e7e7', '#f8f8f8');
  }
/*
  COLORS:
    danger
      innate: #f14668  =  (241, 70, 104)  -->  (1, 1, 1)
      hover: #f03a5f  =  (240, 58, 95)  -->  (.996, .829, .913)
      focus: #df415b  =  (223, 65, 91)  -->  (.925, .929, .875)
      active: #ff4a6e  =  (255, 74, 110)  -->  (1.058, 1.057, 1.058)

    primary
      innate: #00d1b2  =  (0, 209, 178)  -->  (-, 1, 1)
      hover: #00c4a7  =  (0, 196, 167)  -->  (-, .938, .938)
      focus: #00b19a  =  (0, 193, 155)  -->  (-, .923, .871)
      active: #00debd  =  (0, 222, 189)  -->  (-, 1.062, 1.062)

    info
      innate: #3298dc  =  (50, 152, 220)  -->  (1, 1, 1)
      hover: #2793da  =  (39, 147, 218)  -->  (.780, .967, .990)
      focus: #2e8cca  =  (46, 140, 202)  -->  (.920, .921, .918)
      active: #35a1e9  = (53, 161, 233)  -->  (1.060, 1.059, 1.059)

    success
      innate: #48c774 = (72, 199, 116)  -->  (1, 1, 1) 
      hover: #3ec46d = (62, 196, 109)  -->  (.861, .985, .940)
      focus: #42b76b = (66, 183, 107)  -->  (.917, .920, .922)
      active: #4cd37b = (76, 211, 123)  -->  (1.056, 1.060, 1.060)

    warning
      innate: #ffdd57 = (255, 221, 87) --> (1, 1, 1)
      hover: #ffdb4a = (255, 219, 74) --> (1, .991, .851)
      focus: #e5c74e = (229, 199, 78)
      active: #ffea5c = (255, 234, 92)
*/
}