import { contentAreasGridStyles, mainAreaPadding } from '../style';
export * from '../style';

const { contentAreasRow, columnContentArea } = contentAreasGridStyles;

export default function getStyle(rowHeight) {

  const basicsWidthPercent = 40;

  return {
    quickNav: {
      marginBottom: mainAreaPadding,
      display: 'inline-block'
    },
    contentAreasRow: {
      ...contentAreasRow,
      height: rowHeight
    },
    basics: {
      ...columnContentArea(basicsWidthPercent, true, true),
      left: 0
    },
    menu: {
      ...columnContentArea(100 - basicsWidthPercent, true),
      right: 0
    }
  };
};