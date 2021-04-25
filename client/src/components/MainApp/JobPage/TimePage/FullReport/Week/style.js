import { tableAreaStyleVars, topLevelAreaHeaderStyle } from '../style';
export * from '../style';

const { bLevelAreaLeftPxPadding } = tableAreaStyleVars;

export default function getStyle() {
  console.log('get week report style\n  >>>> "topLevelAreaHeaderStyle":\n', topLevelAreaHeaderStyle)
  return {
    areaHeader: {
      ...topLevelAreaHeaderStyle
    },
    areaBody: {
      paddingLeft: bLevelAreaLeftPxPadding,
      paddingRight: bLevelAreaLeftPxPadding
    }
  };
};
