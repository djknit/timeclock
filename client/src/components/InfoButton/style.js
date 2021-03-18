export default function getStyle(styleProp) {
  return {
    button: {
      height: 'auto',
      lineHeight: 1,
      fontSize: '.6em',
      padding: 2,
      borderRadius: '50%',
      ...styleProp
    },
    icon: {
      display: 'inline-block',
      width: '1em'
    }
  };
};
