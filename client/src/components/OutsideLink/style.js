export default function getStyle(styles, state) {
  if (!styles) return {};
  const innateStyle = styles.innate || {};
  const activeStyle = (state.isActive && styles.active) || {};
  const hoverStyle = (state.isHovered && styles.hover) || {};
  const focusStyle = (state.isFocused && styles.focus) || {};

  return {
    ...innateStyle,
    ...hoverStyle,
    ...focusStyle,
    ...activeStyle
  };
};