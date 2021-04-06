const headingStyleVars = {
  dividerHeight: '2px',
  labelEmFontSize: 1,
  labelFontWeight: 600
};

export default function getStyle() {
  return {
    heading: {
      textAlign: 'left',
      fontWeight: headingStyleVars.labelFontWeight,
      fontSize: '1.1em'
    }
  };
};

export { headingStyleVars };
