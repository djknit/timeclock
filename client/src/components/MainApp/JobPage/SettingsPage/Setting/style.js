import { isWindowWide } from '../utilities';
import {
  dashContentBtnSpecs, getContentAreaCornerButtonStyles, adjustBtnSpecs, contentAreaPadding
} from '../../style';
export * from '../../style';

export default function getStyle(styleProp, windowWidth) {
  const addValBtnWidthPerHeight = 5.6335; // Measured. Depends on text and needs changed manually if text changes.

  const btnSpecs = adjustBtnSpecs(
    dashContentBtnSpecs,
    isWindowWide(windowWidth) ? 1.5 : 1.16
  );

  const { btnInnateStyle, titleWidth } = getContentAreaCornerButtonStyles(
    btnSpecs, addValBtnWidthPerHeight, contentAreaPadding, contentAreaPadding, 8
  );

  return {
    contentArea: {
      position: 'relative',
      ...styleProp
    },
    areaTitle: {
      width: titleWidth
    },
    addValBtn: {
      innate: btnInnateStyle
    }
  };
};
