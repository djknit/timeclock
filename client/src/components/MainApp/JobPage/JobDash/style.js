import { isWindowWide } from '../utilities';
import { contentAreasGridStyles, mainAreaPadding, getContentButtonStyle } from '../style';
export * from '../style';

const { contentAreasRow, columnContentArea } = contentAreasGridStyles;

export default function getStyle(windowWidth) {

  const basicsWidthPercent = 40;

  const useColumns = isWindowWide(windowWidth);

  return {
    quickNav: {
      marginBottom: mainAreaPadding,
      display: 'inline-block'
    },
    contentAreasRow: {
      ...contentAreasRow
    },
    basics: {
      ...columnContentArea(basicsWidthPercent, useColumns, true),
    },
    settings: {
      ...columnContentArea(100 - basicsWidthPercent, useColumns, false),
      marginBottom: 0
    }
  };
};