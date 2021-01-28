import { dashContentBtnSpecs, getContentAreaCornerButtonStyles } from '../style';

export default function getStyle(additionalStyle) {
  const addJobBtnWidthPerHeight = 3.1426; // Measured. Depends on text and needs changed manually if text changes.

  const { btnInnateStyle, titleWidth } = getContentAreaCornerButtonStyles(
    dashContentBtnSpecs, addJobBtnWidthPerHeight, 12, 12
  );

  return {
    contentArea: {
      position: 'relative',
      ...(additionalStyle || {})
    },
    areaTitle: {
      width: titleWidth
    },
    table: {
      backgroundColor: 'transparent'
    },
    trStyles: {
      innate: {
        cursor: 'pointer'
      },
      hover: {
        backgroundColor: '#dddddd'
      },
      active: {
        backgroundColor: '#f5f5f5'
      },
      focus: {
        backgroundColor: '#d9d9d9',
        outline: 'none'
      }
    },
    addJobButton: {
      innate: btnInnateStyle,
    },
    noJobNotificationTitle: {
      fontSize: '1.5em',
      fontWeight: 600
    }
  };
};
