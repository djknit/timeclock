import { tableAreaStyleVars, secondLevelHeaderStyle, secondLevelHeaderStyleVars } from '../style';

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

export { getHeaderStyleVars };


function getHeaderStyleVars() {
  return { ...secondLevelHeaderStyleVars };
}
