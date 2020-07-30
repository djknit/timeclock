import { isWindowWide } from '../utilities';
import { contentAreasGridStyles } from '../style';
export * from '../style';

const { contentAreasRow, columnContentArea } = contentAreasGridStyles;

export default function getStyle(windowWidth) {
  const accountWidthPercent = 40;

  const useColumns = isWindowWide(windowWidth);

  return {
    contentAreasRow: {
      ...contentAreasRow
    },
    account: {
      ...columnContentArea(accountWidthPercent, useColumns, true)
    },
    jobs: {
      ...columnContentArea(100 - accountWidthPercent, useColumns, false)
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