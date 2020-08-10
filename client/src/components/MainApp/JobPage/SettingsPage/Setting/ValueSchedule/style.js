import { dashContentBtnSpecs, adjustBtnSpecs, getBtnStyleFromSpecs } from '../style';

export default function getStyle(isWage) {
  const btnSpecs = adjustBtnSpecs(dashContentBtnSpecs, 1.1);
  
  const td = {
    verticalAlign: 'middle',
    textAlign: 'left',
    // whiteSpace: 'nowrap'
  };

  return {
    table: {
      width: '100%',
      textAlign: 'center',
      backgroundColor: 'transparent'
    },
    td: {
      width: '20%'
    },
    valueTd: {
      ...td,
      width: '100%',

    },
    button: {
      innate: {
        ...getBtnStyleFromSpecs(btnSpecs),
        marginRight: '.5rem'
      }
    }
  };
};