export * from '../style';

const labelWeight = 600;
const cellXPadding = '0.75em', cellYPadding = '0.5em'; // matches Bulma

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

export { labelWeight, cellXPadding, cellYPadding };
