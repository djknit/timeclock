import { contentAreasGridStyles, mainAreaPadding } from '../style';
export * from '../style';

const { contentAreasRow, columnContentArea } = contentAreasGridStyles;

export default function getStyle() {

  const basicsWidthPercent = 40;

  return {
    quickNav: {
      marginBottom: mainAreaPadding,
      display: 'inline-block'
    },
    contentAreasRow,
    basics: {
      ...columnContentArea(basicsWidthPercent, true),
      left: 0
    },
    menu: {
      ...columnContentArea(100 - basicsWidthPercent, true),
      right: 0
    }
  };
};