import { contentAreaPadding } from './contentAreas'

const dashContentBtnSpecs = {
  remFontSize: 1.8,
  xPadding: 5,
  yPadding: 5,
  lineHeight: 1
};

function adjustBtnSpecs(unadjustedSpecs, targetRemFontSize) {
  const adjustmentFactor = targetRemFontSize / unadjustedSpecs.remFontSize;
  return {
    remFontSize: targetRemFontSize,
    xPadding: unadjustedSpecs.xPadding * adjustmentFactor,
    yPadding: unadjustedSpecs.yPadding * adjustmentFactor,
    lineHeight: unadjustedSpecs.lineHeight
  };
}

function getBtnStyleFromSpecs(btnSpecs) {
  return {
    padding: `${btnSpecs.yPadding}px ${btnSpecs.xPadding}px`,
    fontSize: `${btnSpecs.remFontSize}rem`,
    lineHeight: btnSpecs.lineHeight,
    height: 'auto'
  };
};

function getContentButtonStyle(targetRemFontSize) {
  const specs = (
    targetRemFontSize ?
    adjustBtnSpecs(dashContentBtnSpecs, targetRemFontSize) :
    { ...dashContentBtnSpecs }
  );
  return getBtnStyleFromSpecs(specs);
}

function getContentAreaCornerButtonStyles( // NOTE: `textWidthToHeightRatio` is (width / fontSize) not (width / height).
  btnSpecs, textWidthToHeightRatio, distanceFromTopEdge, distanceFromRightEdge, titlePadding
) {
  const _titlePadding = titlePadding || (titlePadding === 0 ? 0 : 6);
  const _top = distanceFromTopEdge ||12;
  const _right = distanceFromRightEdge || 12;
  const { xPadding, remFontSize } = btnSpecs;
  const innerRemWidth = textWidthToHeightRatio * remFontSize;
  const rightOffset = _right - contentAreaPadding;
  return {
    titleWidth: `calc(100% - ${innerRemWidth}rem - ${2 * xPadding + _titlePadding + rightOffset + 2}px)`,
    btnInnateStyle: {
      ...getBtnStyleFromSpecs(btnSpecs),
      position: 'absolute',
      top: _top,
      right: _right
    }
  };
}

export {
  dashContentBtnSpecs,
  adjustBtnSpecs,
  getContentButtonStyle,
  getContentAreaCornerButtonStyles,
  getBtnStyleFromSpecs
};