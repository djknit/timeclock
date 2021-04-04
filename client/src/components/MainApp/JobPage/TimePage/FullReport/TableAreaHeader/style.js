import { marginBetweenTableAreas } from '../style';

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
    },
    table: {
      marginBottom: marginBetweenTableAreas,
      marginLeft: 20,
      marginRight: 0
    }
  };
};

export { headingStyleVars };
