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
      ...contentAreasRow
    },
    basics: {
      ...columnContentArea(basicsWidthPercent, true, true),
    },
    menu: {
      ...columnContentArea(100 - basicsWidthPercent, true, false),
    }
  };
};