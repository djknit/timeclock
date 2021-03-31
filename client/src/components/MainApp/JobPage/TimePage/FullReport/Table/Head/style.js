import { labelWeight } from '../style';

export default function getStyle() {
  const th = {
    fontWeight: labelWeight
  };
  return {
    th,
    timesTh: {
      textAlign: 'center',
      ...th
    },
    numAmountColTh: {
      textAlign: 'right',
      ...th
    }
  };
};
