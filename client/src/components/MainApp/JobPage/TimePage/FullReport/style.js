import { contentAreaDividerColor } from '../style';
export * from '../style';

const tableAreaStyleVars = {
  marginBetweenAreas: '1.2rem',
  tableLeftMargin: '20px',
  tableRightMargin: 0
};

export default function getStyle(styleProp) {

  const borderStyle = `3.4px solid ${contentAreaDividerColor}`;

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

export { tableAreaStyleVars };
