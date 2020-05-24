import {
  headingFontFam, sectionHeadingFontFam, shadow, mainBackgroundColor, secondaryBackgroundColor, footerHeight
} from '../../AppStyle';

const mainAreaPadding = 20;

export default function getStyle(navHeight) {
  return {
    mainContentArea: {
      minHeight: `calc(100vh - ${footerHeight + (navHeight || 0)}px)`,
      padding: mainAreaPadding
    }
  };
};

export { headingFontFam, sectionHeadingFontFam, shadow, mainBackgroundColor, secondaryBackgroundColor, mainAreaPadding };