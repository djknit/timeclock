import { itemAreaStyles } from '../style';

const valueLabel = {
  fontWeight: 500
};

export default function getStyle() {

  return {
    p: itemAreaStyles.areaHasBtnsText,
    valueLabel: { ...valueLabel }
  };
};

export { valueLabel, itemAreaStyles };