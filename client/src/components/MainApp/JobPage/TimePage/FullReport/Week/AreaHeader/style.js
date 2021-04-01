import { styles as headerStyles } from '../../../InnerAreaHeader';

const { getLabelTextEmHeight } = headerStyles;

const headerStyleVars = {
  dividerHeight: '2.6px'
};

export default function getStyle(isPartialWeek) {
  
  const labelEmHeight = getLabelTextEmHeight();
  const partialNoteEmFontSize = 0.85;
  const partialNoteLineHeight = 1.5;

  let areaHeader = {
    marginBottom: '0.8rem'
  };
  if (isPartialWeek) {
    areaHeader.paddingBottom = `${partialNoteLineHeight}em`; // matches note height as defined below including asterisk
  }

  const labelFontSizeInPartialNoteEm = 1 / partialNoteEmFontSize; // fs of label w/ respect to partial note fs

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
      top: `${(labelEmHeight * labelFontSizeInPartialNoteEm) / 2}em`,
      paddingRight: '0.75em',
      lineHeight: partialNoteLineHeight
    },
    partWkNoteAsterisk: {
      fontSize: `${labelFontSizeInPartialNoteEm}em`
    }
  };
};

export { headerStyleVars };
