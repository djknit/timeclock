import { contentAreaBgColor, contentAreaDividerColor } from '../style';
export * from '../style';

export default function getStyle() {
  return {};
};

export { getStyleVars };

function getStyleVars() {
  return {
    backgroundColor: contentAreaBgColor,
    dividerColor: contentAreaDividerColor
  };
}
