import {
  headingFontFam, sectionHeadingFontFam, shadow, mainBackgroundColor, secondaryBackgroundColor, footerHeight
} from '../../AppStyle';

const mainAreaPadding = 20;

export default function getStyle(navHeight) {
  return {
    mainContentArea: {
      minHeight: `calc(100vh - ${footerHeight + (navHeight || 0)}px)`,
      padding: mainAreaPadding
    }
  };
};

const contentAreaPadding = 15;

const contentAreasGridStyles = {
  contentAreasRow: {
    position: 'relative',
    padding: 0,
    margin: 0,
    width: '100%'
  },
  columnContentArea(widthPercent, useColumns) {
    return (
      useColumns ?
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
  }
};

const contentAreaDividerColor = '#b3b3b3';

function getInfoItemAreaStyles(
  xPadding = '.75em', yPadding = '1.25em', innerGap = '1em', fontSize = '1rem', buttonSpecs
) {
  // note: yPadding must be at least [.5em + (.25 * fontSize)] for calculations to work
  const itemAreaStyles = {
    fontSize,
    paddingLeft: xPadding,
    paddingRight: xPadding,
    paddingTop: 0,
    textAlign: 'right'
  };

  const buttonInnateStyle = (
    buttonSpecs ?
    {
      padding: `${buttonSpecs.yPadding}px ${buttonSpecs.xPadding}px`,
      fontSize: `${buttonSpecs.remFontSize}rem`,
      lineHeight: buttonSpecs.lineHeight,
      height: 'auto'
    } :
    {}
  );

  const unneededFirstAreaTopPadding = '.5em';

  const areaWithBorderStyles = {
    borderBottom: `solid 1px ${contentAreaDividerColor}`,
    marginBottom: unneededFirstAreaTopPadding
  };

  const textGhostYPadding = `(.25 * ${fontSize})`;

  const textStyles = {
    textAlign: 'left',
    padding: '.5em 0 .75em',
    paddingTop: `calc(${yPadding} - ${unneededFirstAreaTopPadding} - ${textGhostYPadding})`,
    paddingLeft: 0,
    paddingRight: 0
  };

  return {
    areaNotLastHasBtns: {
      ...itemAreaStyles,
      ...areaWithBorderStyles,
      paddingBottom: yPadding
    },
    lastAreaHasBtns: {
      ...itemAreaStyles,
      paddingBottom: `calc(${yPadding} - ${contentAreaPadding})`
    },
    areaNotLastNoBtns: {
      ...itemAreaStyles,
      ...areaWithBorderStyles,
      paddingBottom: `calc(${yPadding} - ${textGhostYPadding})`
    },
    lastAreaNoBtns: {
      ...itemAreaStyles,
      paddingBottom: `calc(${yPadding} - ${textGhostYPadding} - ${contentAreaPadding})`
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

function adjustBtnSpecs(unadjustedSpecs, targetRemFontSize) {
  const adjustmentFactor = targetRemFontSize / unadjustedSpecs.remFontSize;
  return {
    remFontSize: targetRemFontSize,
    xPadding: unadjustedSpecs.xPadding * adjustmentFactor,
    yPadding: unadjustedSpecs.yPadding * adjustmentFactor,
    lineHeight: unadjustedSpecs.lineHeight
  };
}

export {
  headingFontFam,
  sectionHeadingFontFam,
  shadow,
  mainBackgroundColor,
  secondaryBackgroundColor,
  mainAreaPadding,
  contentAreaPadding,
  contentAreasGridStyles,
  contentAreaDividerColor,
  getInfoItemAreaStyles,
  adjustBtnSpecs
};