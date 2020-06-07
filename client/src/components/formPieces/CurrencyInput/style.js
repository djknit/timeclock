export default function getStyle() {

  // Match `amountDisplay` height to Bulma .input height, then add a few px on both top and bottom (next line)
  const displayHeightAdjustment = 6;
  // Bulma .input styles:
    // font-size 1rem, line-height 1.5 x fontsize = 1.5 x 1rem = 1.5rem
    // padding-top & bottom: calc(.5em - 1px) = .5 x 1rem - 1px = .5rem - 1px
    // border: 1px
    // height: 1.5rem + 2 x (.5rem - 1px) + 2 x 1px = 1.5rem + 1rem - 2px + 2px = 2.5rem;
  const displayHeight = `calc(2.5rem + ${2 * displayHeightAdjustment}px)`;
  
  const displayText = {
    display: 'inline-block',
    verticalAlign: 'middle',
    fontSize: '1.2rem',
    lineHeight: 1.3
  };
  
  return {
    amountDisplay: {
      display: 'inline-block',
      position: 'absolute',
      right: 0,
      bottom: -displayHeightAdjustment,
      width: '50%',
      padding: '0',
      fontWeight: 400,
      // source for v-centering text: https://stackoverflow.com/questions/8865458/ how-do-i-vertically-center-text-with-css
      height: displayHeight,
      lineHeight: displayHeight
    },
    displayText,
    displayTextNegative: {
      color: '#dc3545',
      ...displayText
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