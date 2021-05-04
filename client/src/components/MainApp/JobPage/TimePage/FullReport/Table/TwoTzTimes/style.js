export default function getStyle(togglerPseudoState, toggleStyles) {
  
  
  return {
    togglerArrow: {
      ...toggleStyles.toggle
    },
    dropdownContainer: {
      display: 'inline-block',
      ...toggleStyles.container
    }
  };
};
