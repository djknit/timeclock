import {
  mainAreaPadding, headingFontFam
} from '../style';

export default function getStyle(additionalStyle) {

  return {
    pageTitleArea: {
      marginBottom: mainAreaPadding,
      ...(additionalStyle || {})
    },
    pageTitle: {
      fontFamily: headingFontFam
    }
  };
};