export default function getStyle(labelAreaStyle) {
  return {
    sectionLabel: {
      position: 'relative',
      ...labelAreaStyle
    },
    sectionLabelText: { // consider: match width and alignment to Bulma horizontal field-label
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 1,
      backgroundColor: '#ffffff',
      paddingRight: 10
    },
    sectionLabelHr: {
      position: 'absolute',
      width: '100%',
      margin: 0,
      top: 12
    }
  };
};