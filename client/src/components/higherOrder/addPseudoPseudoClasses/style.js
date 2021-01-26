function calculateStyleForPseudoClassState(styles, state) {
  if (!styles) return {};

  return {
    ...styles.innate,
    ...(state.isHovered ? styles.hover : undefined),
    ...(state.isFocused ? styles.focus : undefined),
    ...(state.isTabFocused ? styles.tabFocus : undefined),
    ...(state.isActive ? styles.active : undefined)
  };
}

export { calculateStyleForPseudoClassState };
