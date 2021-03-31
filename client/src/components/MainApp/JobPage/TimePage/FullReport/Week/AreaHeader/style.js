import { styles as headerStyles } from '../../../InnerAreaHeader';
import { marginBetweenDays } from '../style';

const { getLabelTextEmHeight } = headerStyles;

export default function getStyle(isPartialWeek) {
  
  const labelEmHeight = getLabelTextEmHeight();
  const partialNoteEmFontSize = 0.85;
  const partialNoteLineHeight = 1.5;

  let areaHeader = {
    marginBottom: marginBetweenDays
  };
  if (isPartialWeek) {
    // DOUBLE CHECK FOLLOWING
    areaHeader.paddingBottom = `${partialNoteLineHeight}em`; // matches note height
  }

  return {
    areaHeader,
    primaryLabel: {
      whiteSpace: 'nowrap',
    },
    sublabel: {
      fontWeight: 'normal',
      fontSize: '1rem',
      paddingLeft: '0.5em',
      display: 'inline-block',
      verticalAlign: 'text-bottom',
    },
    partialWeekNote: {
      display: 'inline-block',
      position: 'absolute',
      fontSize: `${partialNoteEmFontSize}em`,
      right: 0,
      top: `${(labelEmHeight / partialNoteEmFontSize) / 2}em`,
      paddingRight: '0.75em',
      lineHeight: partialNoteLineHeight
    },
    partWkNoteAsterisk: {
      fontSize: `${1 / partialNoteEmFontSize}em`
    }
  };
};
