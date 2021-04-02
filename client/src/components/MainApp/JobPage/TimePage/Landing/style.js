import { isWindowWide } from '../utilities';
import { contentAreasGridStyles, mainAreaPadding } from '../style';
export * from '../style';

const { contentAreasRow, columnContentArea } = contentAreasGridStyles;

export default function getStyle(windowWidth) {
  
  const rightColWidthPercent = 36;

  const useColumns = isWindowWide(windowWidth);
  
  const contentAreaNotLast = { marginBottom: mainAreaPadding };

  return {
    contentAreasRow: {
      ...contentAreasRow
    },
    summaryArea: {
      ...columnContentArea(100 - rightColWidthPercent, useColumns, true),
      ...contentAreaNotLast
    },
    generalEntryArea: {
      ...columnContentArea(rightColWidthPercent, useColumns, false),
      ...contentAreaNotLast
    },
    reportsArea: {}
  };
};
