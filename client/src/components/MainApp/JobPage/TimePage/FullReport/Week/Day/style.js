import { marginBetweenDays } from '../style';

const headingStyleVars = {
  dividerHeight: '2px',
  labelEmFontSize: 1
};

export default function getStyle() {
  return {
    heading: {
      textAlign: 'left',
      fontWeight: 'bold',
    },
    table: {
      marginBottom: marginBetweenDays,
      marginLeft: 20,
      marginRight: 0
    }
  };
};

export { headingStyleVars };
