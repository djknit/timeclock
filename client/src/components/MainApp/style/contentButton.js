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

export {
  dashContentBtnSpecs,
  adjustBtnSpecs,
  getContentButtonStyle
};