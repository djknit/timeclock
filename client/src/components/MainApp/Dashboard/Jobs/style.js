import { dashContentBtnSpecs } from '../style';

export default function getStyle(additionalStyle) {
  const addJobBtnYPadding = dashContentBtnSpecs.yPadding;
  const addJobBtnXPadding = dashContentBtnSpecs.xPadding;
  const addJobBtnWidthPerHeight = 3.1426; // Measured. Depends on text and needs changed manually if text changes.
  const addJobBtnInnerRemWidth = addJobBtnWidthPerHeight * dashContentBtnSpecs.remFontSize;
  const addJobBtnTotalWidth = `calc${addJobBtnInnerRemWidth}rem + ${2 * addJobBtnXPadding}px`;

  return {
    contentArea: {
      position: 'relative',
      ...additionalStyle
    },
    areaTitle: {
      width: `calc(100% - ${addJobBtnInnerRemWidth}rem - ${2 * addJobBtnXPadding + 6}px)`
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
      innate: {
        lineHeight: dashContentBtnSpecs.lineHeight,
        height: 'auto',
        fontSize: `${dashContentBtnSpecs.remFontSize}rem`,
        paddingTop: addJobBtnYPadding,
        paddingBottom: addJobBtnYPadding,
        paddingLeft: addJobBtnXPadding,
        paddingRight: addJobBtnXPadding,
        position: 'absolute',
        top: 12,
        right: 12
      }
    }
  };
}