import { dashContentBtnSpecs, adjustBtnSpecs, getBtnStyleFromSpecs } from '../style';
export * from '../style';

function getSchedEntryBtnStyles(sizeRatio) {
  return adjustBtnSpecs(dashContentBtnSpecs, sizeRatio);
}

const constantSchedStyles = {
  table: {
    width: '100%',
    textAlign: 'center',
    backgroundColor: 'transparent'
  },
  td: {
    verticalAlign: 'top',
    textAlign: 'left'
  }
};

export default function getStyle() {
  const btnSpecs = adjustBtnSpecs(dashContentBtnSpecs, 1.1);
  
  const td = {
    verticalAlign: 'top',
    textAlign: 'left',
    whiteSpace: 'nowrap'
  };

  const dateTdWidth = '13.793%'; // needs ~120px
  const dateTd = {
    ...td,
    width: dateTdWidth
  };

// A NOTE ABOUT <td> WIDTHS:
  // Needs adjusted at least for smaller screens (< ~940px).
  // Should find a way to make sure everything fits and spread remaining space evenly.

  return {
    table: {
      width: '100%',
      textAlign: 'center',
      backgroundColor: 'transparent'
    },
    dateTd,
    dateTdNoDate: {
      ...dateTd,
      textAlign: 'center',
      paddingRight: `calc(${dateTdWidth} - 100px + .75em)` // (td width) - (text width) + (regular td padding)
    },
    valueTd: {
      ...td,
      width: '35.632%' // wage needs ~310px
    },
    buttonsTd: {
      ...td,
      width: '50.575%' // needs ~440px
    },
    button: {
      innate: {
        ...getBtnStyleFromSpecs(btnSpecs),
        marginRight: '.5rem'
      }
    }
  };
};

export {
  getSchedEntryBtnStyles,
  constantSchedStyles
};
