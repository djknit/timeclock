import { contentAreasGridStyles, contentAreaPadding, mainAreaPadding } from '../style';

const { contentAreasRow, columnContentArea } = contentAreasGridStyles;

export default function getStyle(quickNavButtonHeight) {

  const basicsWidthPercent = 60;

  const heightDependentQuickNavTitleStyles = (
    quickNavButtonHeight ?
    {
      height: quickNavButtonHeight,
      lineHeight: `${quickNavButtonHeight}px`
    } :
    {}
  );

  return {
    contentAreasRow,
    basics: {
      ...columnContentArea(basicsWidthPercent, true),
      left: 0
    },
    menu: {
      ...columnContentArea(100 - basicsWidthPercent, true),
      right: 0
    },
    quickNavArea: {
      marginBottom: mainAreaPadding,
      display: 'inline-block',
      paddingBottom: 0,
      paddingRight: 0
    },
    quickNavTitle: {
      display: 'inline-block',
      paddingRight: contentAreaPadding,
      margin: 0,
      verticalAlign: 'middle',
      ...heightDependentQuickNavTitleStyles
    },
    quickNavButton: {
      innate: {
        marginRight: contentAreaPadding,
        marginBottom: contentAreaPadding
      }
    }
  };
};