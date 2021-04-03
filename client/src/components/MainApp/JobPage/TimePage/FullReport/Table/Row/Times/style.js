const mainLineHeight = 1.5; // matches parent elements. Defined here b/c it's needed for date span

export default function getStyle() {
  
  const dateTextStyle = {
    display: 'inline-block',
    lineHeight: mainLineHeight,
    width: 104 // needs updated if other styles change. should replace w/ a calculation
  };

  return {
    startTime: {
      ...dateTextStyle,
      textAlign: 'right'
    },
    endTime: {
      ...dateTextStyle,
      textAlign: 'left'
    }
  };
};

function getDateStyle() {

  const emFontSize = 0.8;
  const lineHeight = 1;

  const parentEmHeight = mainLineHeight * (1 / emFontSize);
  const thisEmHeight = lineHeight;
  const yPadding = `${(parentEmHeight - thisEmHeight) / 2}em`;

  return {
    span: {
      fontSize: `${emFontSize}em`,
      lineHeight,
      paddingTop: yPadding,
      paddingBottom: yPadding,
      display: 'inline-block',
      verticalAlign: 'top'
    }
  };
}

export { getDateStyle };
