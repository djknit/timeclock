import { tableAreaStyleVars } from '../style';

const {
  marginBetweenAreas, tableLeftPxMargin, tableRightPxMargin
} = tableAreaStyleVars;

export default function getStyle() {
  return {
    table: {
      marginBottom: marginBetweenAreas,
      marginLeft: tableLeftPxMargin,
      marginRight: tableRightPxMargin
    }
  };
};
