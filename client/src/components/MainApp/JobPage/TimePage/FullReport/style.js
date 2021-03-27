export default function getStyle(styleProp) {

  const borderStyle = 'solid';

  return {
    wholeReport: {
      borderTop: borderStyle,
      borderBottom: borderStyle,
      ...styleProp
    },
    reportTitle: {
      margin: '0.5em 0'
    }
  };
};
