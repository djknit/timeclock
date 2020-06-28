import { bulmaFormBlack, bulmaFormBlue } from '../style';

export default function getStyle(contentToggleStyles, arrowTogglePseudoState) {
  
  const toggleBtnFontSize = '1.6rem';
  const { isActive, isHovered, isFocused } = arrowTogglePseudoState;
  const isToggleBlack = isActive || isHovered || isFocused;
  
  return {
    sectionContent: {
      ...contentToggleStyles.container
    },
    sectionFooter: {
      position: 'relative'
    },
    footerHr: {
      marginTop: 12,
      marginBottom: 16,
      width: `calc(100% - 10px - ${toggleBtnFontSize})`
    },
    sectionToggle: {
      ...contentToggleStyles.toggle,
      position: 'absolute',
      right: 0,
      fontSize: toggleBtnFontSize,
      bottom: `calc(-.5em + 1px)`,
      color: isToggleBlack ? bulmaFormBlack : bulmaFormBlue
    }
  };
};