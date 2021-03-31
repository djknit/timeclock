export * from '../style';

const labelWeight = 600;

export default function getStyle(styleProp) {
  return {
    table: {
      backgroundColor: 'transparent',
      ...styleProp
    }
  };
};

export { labelWeight };
