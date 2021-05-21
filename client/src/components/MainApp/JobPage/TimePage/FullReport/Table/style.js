import { contentAreaDividerColor, tableCellXPadding as cellXPadding } from '../style';
export * from '../style';

const labelWeight = 600;
const cellYPadding = '0.5em'; // matches Bulma

const commonTdStyle = {
  borderColor: contentAreaDividerColor,
  whiteSpace: 'nowrap',
  borderWidth: '0.7px 0 0',
  padding: `${cellYPadding} ${cellXPadding}`
}
const firstRowTdStyle = {
  ...commonTdStyle,
  borderWidth: '1.5px 0 0'
};

const commonStyles = {
  td: commonTdStyle,
  numAmountTd: {
    ...commonTdStyle,
    textAlign: 'right'
  },
  firstRowTd: firstRowTdStyle,
  firstRowNumAmountTd: {
    ...firstRowTdStyle,
    textAlign: 'right'
  }
};

export default function getStyle(styleProp, tableWidth) {
  return {
    table: {
      backgroundColor: 'transparent',
      width: tableWidth,
      tableLayout: 'fixed', // source: https://stackoverflow.com/a/7360516
      ...styleProp
    }
  };
};

export { labelWeight, cellXPadding, cellYPadding, commonStyles };
