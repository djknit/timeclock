import { itemAreaStyles } from '../../JobDash/Settings/style';
import { getInfoItemAreaStyles } from '../style';

export default function getStyle(additionalStyle) {

  const innerAreaStyles = getInfoItemAreaStyles(undefined, undefined, '0em', undefined, 1)

  return {
    contentArea: {
      ...additionalStyle
    },
    ...itemAreaStyles,
    areaLabel: {
      ...itemAreaStyles.areaHasBtnsText,
      fontSize: '1.15em',
      fontWeight: 'bold'
    }
  };
};