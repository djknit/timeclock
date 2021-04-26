export * from '../style';

const labelWeight = 600;
const cellXPadding = '0.75em', cellYPadding = '0.5em'; // matches Bulma

export default function getStyle(styleProp) {
  return {
    table: {
      backgroundColor: 'transparent',
      ...styleProp
    }
  };
};

export { labelWeight, cellXPadding, cellYPadding };
