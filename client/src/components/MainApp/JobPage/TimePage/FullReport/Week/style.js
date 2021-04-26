import { tableAreaStyleVars } from '../style';
export * from '../style';

const { bLevelAreaLeftPxPadding } = tableAreaStyleVars;

export default function getStyle() {
  return {
    areaBody: {
      paddingLeft: bLevelAreaLeftPxPadding,
      paddingRight: bLevelAreaLeftPxPadding
    }
  };
};
