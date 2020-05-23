import { headingFontFam, shadow, mainBackgroundColor, secondaryBackgroundColor, footerHeight } from '../../AppStyle';

export default function getStyle(navHeight) {
  return {
    mainContentArea: {
      height: `calc(100vh - ${footerHeight + (navHeight || 0)}px)`,
      padding: 20
    },
    jobsArea: {
      height: '100%',
      width: '100%',
      backgroundColor: '#f1f1f1'
    }
  };
};

export { headingFontFam, shadow, mainBackgroundColor, secondaryBackgroundColor };