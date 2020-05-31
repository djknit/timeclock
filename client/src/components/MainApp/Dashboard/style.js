import { sectionHeadingFontFam, mainAreaPadding, headingFontFam } from '../style';

export default function getStyle(windowWidth) {
  const accountWidthPercent = 40;

  const columnContentArea = widthPercent => (
    windowWidth > 780 ?
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

  return {
    pageTitleArea: {
      marginBottom: mainAreaPadding
    },
    pageTitle: {
      fontFamily: headingFontFam
    },
    contentAreasRow: {
      position: 'relative',
      padding: 0,
      margin: 0,
      width: '100%'
    },
    account: {
      ...columnContentArea(accountWidthPercent),
      left: 0
    },
    jobs: {
      ...columnContentArea(100 - accountWidthPercent),
      right: 0
    }
  };
};