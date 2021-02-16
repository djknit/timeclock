import { dividerMargin } from '../style';


export default function getStyle(isSegmentsDefined) {

  let noSegsText = { padding: '0.5em 0' };

  if (isSegmentsDefined) {
    noSegsText.fontStyle = 'italic';
  }

  return {
    noSegsText,
    divider: {
      margin: `${dividerMargin} 0`
    }
  };
};


function getSegmentsAddedOnDayStyle() {
  
  return {
    areaLabel: {
      color: '#888888',
      marginBottom: dividerMargin,
      fontWeight: 600
    }
  };
};

export {
  dividerMargin,
  getSegmentsAddedOnDayStyle
};
