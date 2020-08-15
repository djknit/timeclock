import {
  dashContentBtnSpecs, getContentAreaCornerButtonStyles, adjustBtnSpecs, contentAreaPadding
} from '../../style';
export * from '../../style';

export default function getStyle(additionalStyle) {
  const addValBtnWidthPerHeight = 5.6335; // Measured. Depends on text and needs changed manually if text changes.

  const btnSpecs = adjustBtnSpecs(dashContentBtnSpecs, 1.5);

  const { btnInnateStyle, titleWidth } = getContentAreaCornerButtonStyles(
    btnSpecs, addValBtnWidthPerHeight, contentAreaPadding, contentAreaPadding, 8
  );


  return {
    contentArea: {
      position: 'relative',
      ...(additionalStyle || {})
    },
    areaTitle: {
      width: titleWidth
    },
    addValBtn: {
      innate: btnInnateStyle
    }
  };
};