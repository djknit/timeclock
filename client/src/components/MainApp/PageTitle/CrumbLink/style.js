import { contentAreaTextLinkColors } from '../style';

export default function getStyle(pseudoState) {

  const { isActive, isHovered, isFocused, isTabFocused } = pseudoState;

  let stateDependentStyle;
  if (isActive) {
    stateDependentStyle = {
      fontWeight: 700,
      color: contentAreaTextLinkColors.active
    };
  }
  else if (isTabFocused) {
    stateDependentStyle = {
      fontWeight: 700,
      color: contentAreaTextLinkColors.focus,
      textDecoration: 'underline'
    };
  }
  else if (isFocused) {
    stateDependentStyle = {
      fontWeight: 700,
      color: contentAreaTextLinkColors.focus
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