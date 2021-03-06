import { constantSchedStyles } from '../style';

export default function getStyle(isWage) {
  
  const td = {
    ...constantSchedStyles.td,
    whiteSpace: 'nowrap'
  };

  const dateTdWidth = '13.793%'; // needs ~120px (estimated based on current conditions. largest possible text width depends on text, font size/style)
  const dateTd = {
    ...td,
    width: dateTdWidth
  };

// A NOTE ABOUT <td> WIDTHS:
  // Needs adjusted at least for smaller screens (< ~940px).
  // Should find a way to make sure everything fits and spread remaining space evenly.

  return {
    table: constantSchedStyles.table,
    dateTd,
    dateTdNoDate: {
      ...dateTd,
      textAlign: 'center',
      paddingRight: `calc(${dateTdWidth} - 100px + 0.75em)` // (td width) - (text width) + (regular td paddingLeft) // text width is estimated (heading text width)
    },
    valueTd: {
      ...td,
      width: '35.632%', // wage needs ~310px
      position: 'relative'
    },
    buttonsTd: {
      ...td,
      width: '50.575%' // needs ~440px
    }
  };
};
