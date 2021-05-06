export default function getStyle(togglerPseudoState, toggleStyles) {
  
  const arrowWidth = '1em';
  
  return {
    togglerArrow: {
      ...toggleStyles.toggle,
      width: arrowWidth,
      verticalAlign: 'bottom'
    },
    dropdownContainer: {
      display: 'block',
      ...toggleStyles.container
    }
  };
};
