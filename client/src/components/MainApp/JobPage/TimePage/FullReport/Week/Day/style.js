import { tableAreaStyleVars } from '../style';

const {
  marginBetweenAreas, tableLeftPxMargin, tableRightPxMargin
} = tableAreaStyleVars;

export default function getStyle() {
  return {
    header: {
      fontSize: '1.1em'
    },
    table: {
      marginBottom: marginBetweenAreas,
      marginLeft: tableLeftPxMargin,
      marginRight: tableRightPxMargin
    }
  };
};
