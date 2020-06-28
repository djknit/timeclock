import { timeInputStyles } from '../style';

export default function getStyle() {

  return {
    hoursInput: {
      width: '3.5em',
      textAlign: 'right'
    },
    ...timeInputStyles
  };
}