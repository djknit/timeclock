import { sectionHeadingFontFam } from '../../AppStyle';

export default function getStyle(windowWidth) {
  return {
    wholePage: {
      padding: 20
    },
    title: {
      margin: windowWidth > 500 ? '20px 0 60px' : undefined,
      fontFamily: sectionHeadingFontFam
    },
    img: {
      maxWidth: '70%'
    }
  };
}