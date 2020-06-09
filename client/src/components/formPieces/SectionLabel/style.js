export default function getStyle() {
  return {
    sectionLabel: {
      position: 'relative'
    },
    sectionLabelText: { // consider: match width and alignment to Bulma horizontal field-label
      position: 'absolute',
      left: 0,
      top: 0,
      backgroundColor: '#ffffff',
      zIndex: 1,
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