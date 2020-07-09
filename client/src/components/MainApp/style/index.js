import {
  headingFontFam, sectionHeadingFontFam, shadow, mainBackgroundColor, secondaryBackgroundColor, footerHeight
} from '../../../AppStyle';
import { mainAreaPadding } from './mainArea';
export * from './contentAreas';
export * from './contentButton';
export * from './infoItemArea';

export default function getStyle(navHeight) {
  return {
    mainContentArea: {
      minHeight: `calc(100vh - ${footerHeight + (navHeight || 0)}px)`,
      padding: mainAreaPadding
    }
  };
};

export {
  headingFontFam,
  sectionHeadingFontFam,
  shadow,
  mainBackgroundColor,
  secondaryBackgroundColor,
  mainAreaPadding
};