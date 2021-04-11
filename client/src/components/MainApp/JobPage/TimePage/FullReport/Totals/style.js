import { tableAreaStyleVars } from '../style';

const {
  marginBetweenAreas, tableLeftMargin, tableRightMargin
} = tableAreaStyleVars;

export default function getStyle() {

  return {
    table: {
      marginBottom: marginBetweenAreas,
      marginLeft: tableLeftMargin,
      marginRight: tableRightMargin
    }
  };
};
