import { labelWeight, contentAreaDividerColor } from '../style';

const bottomBorderWidth = '1.5px';

export default function getStyle() {
  const th = {
    fontWeight: labelWeight,
    border: `${bottomBorderWidth} solid ${contentAreaDividerColor}`,
    borderWidth: `0 0 ${bottomBorderWidth}`
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
