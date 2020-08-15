import { dashContentBtnSpecs, adjustBtnSpecs, getBtnStyleFromSpecs } from '../style';

export default function getStyle(isWage) {
  const btnSpecs = adjustBtnSpecs(dashContentBtnSpecs, 1.1);
  
  const td = {
    verticalAlign: 'middle',
    textAlign: 'left',
    // whiteSpace: 'nowrap'
  };

// A NOTE ABOUT <td> WIDTHS:
  // Currently using hardcoded pixel widths to ensure date and buttons fit and letting value take remaining width
  // Needs adjusted at least for smaller screens.
  // Should find a way to make sure everything fits and spread remaining space evenly.

  return {
    table: {
      width: '100%',
      textAlign: 'center',
      backgroundColor: 'transparent'
    },
    td: {
      ...td,
      width: 120
    },
    valueTd: {
      ...td
    },
    buttonsTd: {
      ...td,
      width: 440
    },
    button: {
      innate: {
        ...getBtnStyleFromSpecs(btnSpecs),
        marginRight: '.5rem'
      }
    }
  };
};