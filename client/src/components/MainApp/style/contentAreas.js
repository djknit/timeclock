import { mainAreaPadding } from './mainArea';

const contentAreaPadding = 15;

const contentAreasGridStyles = {
  contentAreasRow: {
    position: 'relative',
    padding: 0,
    margin: 0,
    width: '100%'
  },
  columnContentArea(widthPercent, useColumns) {
    return (
      useColumns ?
      {
        width: `calc(${widthPercent}% - ${mainAreaPadding / 2}px)`,
        position: 'absolute',
        top: 0,
        display: 'inline-block'
      } :
      {
        width: '100%',
        marginBottom: mainAreaPadding
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