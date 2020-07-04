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
    },
    breadcrumbSeparator: {
      display: 'inline-block',
      padding: '0 .6em',
      color: '#595959'
    },
  };
};