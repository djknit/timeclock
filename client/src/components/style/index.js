// ABOUT THIS FILE/FOLDER:
  // For styles used by more than one component which are not descendent from the same top-level component.
  // Turns out don't actually need this folder for style it was created for, but leaving here for now in case needed.

import { dynamicBgColors} from '../../AppStyle';
export * from '../../AppStyle';

const notificationDefaultMarginBottom = 10;

export {
  getDynamicBgStylesForTheme,
  notificationDefaultMarginBottom
};


function getDynamicBgStylesForTheme(colorTheme = 'light') {
  const themeWords = colorTheme.split(' ').map(word => word.trim().toLowerCase());
  let processedTheme = findFirstWordNotLight(themeWords);
  if (colorTheme.includes('light')) {
    processedTheme += `${processedTheme ? 'L' : 'l'}ight`;
  }
  let dynamicBgColorsForTheme = dynamicBgColors[processedTheme];
  if (!dynamicBgColorsForTheme) return;
  let bgColorStyles = {};
  for (const pseudoClass in dynamicBgColorsForTheme) {
    bgColorStyles[pseudoClass] = { backgroundColor: dynamicBgColorsForTheme[pseudoClass] };
  }
  return bgColorStyles;
}

function findFirstWordNotLight(words) {
  for (const word of words) {
    if (word !== 'light') return word;
  }
  return '';
}
