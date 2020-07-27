import { isWindowWide } from '../utilities';
import { contentAreasGridStyles } from '../style';
export * from '../style';

const { contentAreasRow, columnContentArea } = contentAreasGridStyles;

export default function getStyle(windowWidth, rowHeight) {
  const accountWidthPercent = 40;

  const useColumns = isWindowWide(windowWidth);

  return {
    contentAreasRow: {
      ...contentAreasRow,
      height: useColumns ? rowHeight : 'auto'
    },
    account: {
      ...columnContentArea(accountWidthPercent, useColumns, true),
      left: 0
    },
    jobs: {
      ...columnContentArea(100 - accountWidthPercent, useColumns, false),
      right: 0
    }
  };
};

const dashContentBtnSpecs = {
  remFontSize: 1.8,
  xPadding: 5,
  yPadding: 5,
  lineHeight: 1
};

export { dashContentBtnSpecs };