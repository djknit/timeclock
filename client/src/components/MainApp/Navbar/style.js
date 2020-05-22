import { headingFontFam } from '../style';

export default function getStyle(brandItemInnerHeight, totalHeight) {
  return {
    nav: {
      backgroundColor: '#f4f4f4'
    },
    brandTextItem: {
      paddingLeft: 2
    },
    brandText: {
      display: 'inline-block',
      height: '100%',
      fontFamily: headingFontFam,
      fontSize: brandItemInnerHeight && (brandItemInnerHeight / 2)  ,
      lineHeight: 1,
      textAlign: 'left'
    },
    brandImgItem: {
      paddingTop: 0,
      paddingBottom: 0,
      paddingRight: 0
    },
    brandImg: {
      height: totalHeight,
      maxHeight: totalHeight,
      width: totalHeight
    }
  };
};