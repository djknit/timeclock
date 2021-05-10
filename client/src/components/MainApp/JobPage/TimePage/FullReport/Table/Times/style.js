const mainLineHeight = 1.5; // matches parent elements. Defined here b/c it's needed for date span

export default function getStyle(timezone) {
  
  const timeAndDateStyle = {
    display: 'inline-block',
    lineHeight: mainLineHeight,
    width: '6.5em' // needs updated if other styles or content change. should maybe replace w/ a calculation?
  };

  return {
    startTime: {
      ...timeAndDateStyle,
      textAlign: 'right'
    },
    endTime: {
      ...timeAndDateStyle,
      textAlign: 'left',
      width: timezone ? `calc(${timeAndDateStyle.width} + 3.5em)` : timeAndDateStyle.width
    }
  };
};

export { getDateStyle };


function getDateStyle() {

  const emFontSize = 0.8;
  const lineHeight = 1;

  const parentEmHeight = mainLineHeight * (1 / emFontSize);
  const thisEmHeight = lineHeight;
  const yPadding = `${(parentEmHeight - thisEmHeight) / 2}em`

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
