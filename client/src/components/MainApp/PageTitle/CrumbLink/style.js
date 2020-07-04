export default function getStyle(pseudoState) {

  const { isActive, isHovered, isFocused } = pseudoState;

  let stateDependentStyle;
  if (isActive) {
    stateDependentStyle = {
      fontWeight: 700,
      color: '#8a8a8a',
      textDecoration: 'underline'
    };
  }
  else if (isFocused) {
    stateDependentStyle = {
      fontWeight: 700,
      color: '#2a2a2a',
      textDecoration: 'underline'
    };                  
  }
  else if (isHovered) {
    stateDependentStyle = {
      fontWeight: 700,
      color: '#2a2a2a'
    };
  }
  else {
    stateDependentStyle = {
      fontWeight: 600,
      color: '#6a6a6a'
    };
  }

  return {
    outline: 'none',
    ...stateDependentStyle
  };
};