export default function getStyle() {

  const displays = {
    display: 'inline-block',
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '50%',
    padding: '.375rem .75rem 0',
    fontWeight: 400,
    lineHeight: 1.5,
    fontSize: '2rem'
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