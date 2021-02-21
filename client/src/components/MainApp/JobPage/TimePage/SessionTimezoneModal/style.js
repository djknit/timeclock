export default function getStyle() {
  const commonButtonStyle = {
    lineHeight: 1,
    height: 'auto'
  };

  return {
    guessButtonsField: {
      textAlign: 'right'
    },
    guessButton: {
      ...commonButtonStyle,
      fontSize: '1em',
      padding: 5
    },
    guessInfoButton: {
      ...commonButtonStyle,
      fontSize: '.6em',
      padding: 2,
      borderRadius: '50%',
      marginRight: '1rem'
    },
    guessInfoIcon: {
      display: 'inline-block',
      width: '1em'
    }
  };
};
