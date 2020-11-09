import { getInfoItemAreaStyles } from '../style';
export * from '../style';

const defaultItemAreaStyles = getInfoItemAreaStyles();

export default function getStyle(additionalStyle) {

  return {
    contentArea: {
      ...additionalStyle,
    },
    periodTotalsArea: {
      textAlign: 'left',
      padding: `.5em ${defaultItemAreaStyles.areaNotLastHasBtns.paddingLeft}`
    },
    areaLabel: {
      textAlign: 'left',
      fontSize: '1.15em',
      fontWeight: 'bold'
    },
    
  };
};