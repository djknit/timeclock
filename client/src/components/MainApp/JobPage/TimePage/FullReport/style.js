import { contentAreaDividerColor } from '../style';
export * from '../style';

const tableAreaStyleVars = {
  bLevelAreaLeftPxPadding: 20,
  marginBetweenAreas: '1.2rem',
  tableLeftPxMargin: 20,
  tableRightPxMargin: 0
};
const topLevelAreaHeaderStyleVars = {
  dividerHeight: '2.6px',
  containerEmFontSize: 1.32
};
const topLevelAreaHeaderStyle = {
  fontSize: `${topLevelAreaHeaderStyleVars.containerEmFontSize}em`,
  fontWeight: 600
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

export {
  tableAreaStyleVars,
  topLevelAreaHeaderStyle,
  topLevelAreaHeaderStyleVars
};
