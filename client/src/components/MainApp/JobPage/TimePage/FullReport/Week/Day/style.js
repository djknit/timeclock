import { tableAreaStyleVars, secondLevelHeaderStyle } from '../style';

const {
  marginBetweenAreas, tableLeftPxMargin, tableRightPxMargin
} = tableAreaStyleVars;

export default function getStyle() {
  return {
    header: {
      ...secondLevelHeaderStyle
    },
    table: {
      marginBottom: marginBetweenAreas,
      marginLeft: tableLeftPxMargin,
      marginRight: tableRightPxMargin
    }
  };
};
