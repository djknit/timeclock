import { styles as headerStyles } from '../../InnerAreaHeader';

const { getLabelTextEmHeight } = headerStyles;

const labelEmFontSize = 1.25;
const headerStyleVars = {
  dividerHeight: '2.6px',
  labelEmFontSize
};

export default function getStyle(isPartialWeek) {
  
  const labelEmHeight = getLabelTextEmHeight(labelEmFontSize);
  const partialNoteEmFontSize = 0.85;
  const partialNoteLineHeight = 1.5;

  let areaHeader = {
    marginBottom: '0.8rem',

  };
  if (isPartialWeek) {
    areaHeader.paddingBottom = `${partialNoteLineHeight}em`; // matches note height as defined below including asterisk
  }

  const labelFontSizeInPartialNoteEm = 1 / partialNoteEmFontSize; // fs of label w/ respect to partial note fs
  const sublabelFontSizeInContainerEm = 1 + ((labelEmFontSize - 1) / 4); // fs of sublabel w/ respect to parent of label
  const sublabelEmFontSize = sublabelFontSizeInContainerEm / labelEmFontSize; // (w/ respect to label)

  return {
    areaHeader,
    primaryLabel: {
      whiteSpace: 'nowrap',
      fontWeight: 600,
      display: 'inline-block',
      verticalAlign: 'top'
    },
    sublabel: {
      fontWeight: 500,
      fontSize: `${sublabelEmFontSize}em`,
      paddingLeft: '0.5em',
      display: 'inline-block',
      verticalAlign: 'top',
      lineHeight: `${getLabelTextEmHeight(1 / sublabelEmFontSize)}em`
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
