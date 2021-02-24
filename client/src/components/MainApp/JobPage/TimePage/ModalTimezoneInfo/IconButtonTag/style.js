import { dynamicBgColors, calculateStyleForPseudoClassState } from '../style';

// BUG TO FIX ***** ----:
// ^^ dynamicBgColors is empty ??? !!!!!
//            .._  .   .
  //       ..     \.     .
    //  ..          \.c~'l__.    .
      //             V``````\ .   . .

export default function getStyle(theme, pseudoState) {

  let pseudoClassStyles = {}, pseudoClassNames = ['hover', 'focus', 'active'];

  for (const pseudoClass of pseudoClassNames) {
    if (!theme) return;
    pseudoClassStyles[pseudoClass] = {
      backgroundColor: dynamicBgColors[theme][pseudoClass]
    };
  };

  return {
    tag: calculateStyleForPseudoClassState(pseudoClassStyles, pseudoState)
  };
};
