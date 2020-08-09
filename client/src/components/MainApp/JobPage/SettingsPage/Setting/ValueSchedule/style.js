import { dashContentBtnSpecs, adjustBtnSpecs, getBtnStyleFromSpecs } from '../style';

export default function getStyle() {
  const btnSpecs = adjustBtnSpecs(dashContentBtnSpecs, 1.1);
  
  return {
    table: {
      width: '100%',
      textAlign: 'center',
      backgroundColor: 'transparent'
    },
    td: {
      verticalAlign: 'middle',
      textAlign: 'center'
    },
    button: {
      innate: {
        ...getBtnStyleFromSpecs(btnSpecs),
        marginRight: '.5rem'
      }
    }
  };
};