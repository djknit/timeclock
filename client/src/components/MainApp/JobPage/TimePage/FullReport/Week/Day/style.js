import { marginBetweenDays } from '../style';

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
