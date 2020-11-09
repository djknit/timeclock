import { contentAreaTextLinkColors } from '../style';

export default function getStyle(pseudoState) {

  const { isActive, isHovered, isFocused } = pseudoState;

  let stateDependentStyle;
  if (isActive) {
    stateDependentStyle = {
      fontWeight: 700,
      color: contentAreaTextLinkColors.active
    };
  }
  else if (isFocused) {
    stateDependentStyle = {
      fontWeight: 700,
      color: contentAreaTextLinkColors.focus,
      textDecoration: 'underline'
    };                  
  }
  else if (isHovered) {
    stateDependentStyle = {
      fontWeight: 700,
      color: contentAreaTextLinkColors.hover
    };
  }
  else {
    stateDependentStyle = {
      fontWeight: 600,
      color: contentAreaTextLinkColors.innate
    };
  }

  return {
    outline: 'none',
    textDecoration: 'none',
    ...stateDependentStyle
  };
};