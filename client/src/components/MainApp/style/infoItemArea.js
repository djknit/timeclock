import { contentAreaPadding, contentAreaDividerColor } from './contentAreas';
import { getContentButtonStyle } from './contentButton';

function getInfoItemAreaStyles(
  xPadding = '.75em', yPadding = '1.25em', innerGap = '1em', fontSize = '1rem', buttonRemFontSize
) {
  // note: yPadding must be at least .75em for calculations to work
  const itemAreaStyles = {
    fontSize,
    paddingLeft: xPadding,
    paddingRight: xPadding,
    paddingTop: 0,
    textAlign: 'right'
  };

  const buttonInnateStyle = getContentButtonStyle(buttonRemFontSize);

  const unneededFirstAreaTopPadding = '.5em';

  const areaWithBorderStyles = {
    ...itemAreaStyles,
    borderBottom: `solid 1px ${contentAreaDividerColor}`,
    marginBottom: unneededFirstAreaTopPadding
  };

  const textGhostYPadding = '.25em';

  const textStyles = {
    textAlign: 'left',
    padding: '.5em 0 .75em',
    paddingTop: `calc(${yPadding} - ${unneededFirstAreaTopPadding} - ${textGhostYPadding})`,
    paddingLeft: 0,
    paddingRight: 0
  };

  const itemAreaNoTextPaddingTop = `calc(${yPadding} - ${unneededFirstAreaTopPadding})`;

  return {
    areaNotLastHasBtns: {
      ...areaWithBorderStyles,
      paddingBottom: yPadding
    },
    areaNotLastNoBtns: {
      ...areaWithBorderStyles,
      paddingBottom: `calc(${yPadding} - ${textGhostYPadding})`
    },
    areaNotLastHasBtnsNoText: {
      ...areaWithBorderStyles,
      paddingTop: itemAreaNoTextPaddingTop,
      paddingBottom: yPadding
    },
    lastAreaHasBtns: {
      ...itemAreaStyles,
      paddingBottom: `calc(${yPadding} - ${contentAreaPadding}px)`
    },
    lastAreaNoBtns: {
      ...itemAreaStyles,
      paddingBottom: `calc(${yPadding} - ${textGhostYPadding} - ${contentAreaPadding}px)`
    },
    lastAreaHasBtnsNoText: {
      ...itemAreaStyles,
      paddingTop: itemAreaNoTextPaddingTop,
      paddingBottom: `calc(${yPadding} - ${contentAreaPadding}px)`
    },
    firstBtn: {
      innate: { ...buttonInnateStyle }
    },
    btnNotFirst: {
      innate: {
        ...buttonInnateStyle,
        marginLeft: '.5em'
      }
    },
    areaHasBtnsText: {
      ...textStyles,
      paddingBottom: `calc(${innerGap} - ${textGhostYPadding})`
    },
    noBtnsAreaText: {
      ...textStyles,
      paddingBottom: 0
    }
  };
}

export { getInfoItemAreaStyles };