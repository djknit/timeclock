import { contentAreaDividerColor } from '../style';
export * from '../style';

export default function getStyle(styleProp) {

  const borderStyle = `2px solid ${contentAreaDividerColor}`;

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
