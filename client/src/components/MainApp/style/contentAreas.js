import { mainAreaPadding } from './mainArea';

const contentAreaPadding = 15;

const contentAreasGridStyles = {
  contentAreasRow: {
    padding: 0,
    margin: 0,
    width: '100%',
    verticalAlign: 'top',
    textAlign: 'left'
  },
  columnContentArea(widthPercent, useColumns, isLeftCol) {
    if (!useColumns) {
      return {
        width: '100%',
        marginBottom: mainAreaPadding
      };
    }
    const columnStyles = {
      width: `calc(${widthPercent}% - ${mainAreaPadding / 2}px)`,
      display: 'inline-block',
      verticalAlign: 'top',
      textAlign: 'center'
    };
    return (
      isLeftCol === false ?
      {
        position: 'relative',
        left: mainAreaPadding,
        ...columnStyles
      } : 
      {
        ...columnStyles
      }
    );
  }
};

const contentAreaDividerColor = '#b3b3b3';

export {
  contentAreaPadding,
  contentAreasGridStyles,
  contentAreaDividerColor
};