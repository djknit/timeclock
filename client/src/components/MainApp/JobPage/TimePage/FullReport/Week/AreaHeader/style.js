import { styles as headerStyles } from '../../../InnerAreaHeader';
import { topLevelAreaHeaderStyle, topLevelAreaHeaderStyleVars } from '../style';

const { getLabelTextEmHeight } = headerStyles;
const { containerEmFontSize } = topLevelAreaHeaderStyleVars;

const labelEmFontSize = 1;
const sublabelFontSizeInContainerEm = 0.96; // fs of sublabel w/ respect to parent of label
const partialNoteFontSizeInContainerEm = 0.8;
const partialNoteLineHeight = 1.5;

const sublabelEmFontSize = sublabelFontSizeInContainerEm / (containerEmFontSize * labelEmFontSize); // (w/ respect to label)
const partialNoteEmFontSize = partialNoteFontSizeInContainerEm / containerEmFontSize;
const labelEmHeight = getLabelTextEmHeight(labelEmFontSize);
const labelFontSizeInPartialNoteEm = 1 / partialNoteEmFontSize; // fs of label w/ respect to partial note fs

const headerStyleVars = {
  ...topLevelAreaHeaderStyleVars,
  labelEmFontSize
};

export default function getStyle(isPartialWeek) {
  return {
    areaHeader: {
      ...topLevelAreaHeaderStyle,
      marginBottom: isPartialWeek ? 0 :'0.8rem',
      ...(isPartialWeek && { paddingBottom: `${partialNoteLineHeight}em` } ) // matches note height as defined below including asterisk
    },
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
      fontWeight: 'normal',
      right: 0,
      top: `${(labelEmHeight * labelFontSizeInPartialNoteEm) / 2}em`,
      paddingRight: '0.75em',
      lineHeight: partialNoteLineHeight,
    },
    partWkNoteAsterisk: {
      fontSize: `${labelFontSizeInPartialNoteEm}em`
    }
  };
};

export { headerStyleVars };
