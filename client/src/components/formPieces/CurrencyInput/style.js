export default function getStyle() {

  const displays = {
    display: 'inline-block',
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '50%',
    // Next Line: Matches Bulma .input style for y-axis (top/bottom) (this is 1.2x input font size, so instead of `.5em`, it should be (.5 / 1.2)em = .625em)
    padding: 'calc(.625em - 1px) .75rem',
    fontWeight: 400,
    lineHeight: 1,
    fontSize: '1.2rem',
    verticalAlign: 'middle'
  };
  
  return {
    amountDisplay: {
      ...displays
    },
    amountDisplayNegative: {
      color: '#dc3545',
      ...displays
    },
    input: {
      display: 'inline-block',
      width: 'calc(50% - 20px)'
    },
    control: {
      position: 'relative'
    }
  }
}