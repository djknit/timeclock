import { mainAreaPadding } from './mainArea';

const contentAreaPadding = 15;
const contentAreaBgColor = '#f1f1f1';
const contentAreaTextLinkColors = {
  innate: '#6a6a6a',
  active: '#8a8a8a',
  focus: '#2a2a2a',
  hover: '#2a2a2a'
};

const contentAreasGridStyles = {
  contentAreasRow: {
    padding: 0,
    margin: 0,
    width: '100%',
    verticalAlign: 'top',
    textAlign: 'left'
  },
  columnContentArea(widthPercent, useColumns, isLeftCol, isLastContentOnPage) {
    if (!useColumns) {
      return {
        width: '100%',
        marginBottom: isLastContentOnPage ? 0 : mainAreaPadding
      };
    }
    const columnStyles = {
      width: `calc(${widthPercent}% - (${mainAreaPadding} / 2))`,
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
  contentAreaDividerColor,
  contentAreaBgColor,
  contentAreaTextLinkColors
};