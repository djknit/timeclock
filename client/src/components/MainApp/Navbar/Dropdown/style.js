import { backgroundColor, navShadow } from '../style';

export default function getStyle(isFullNavDisplayed, isDropdownActive, arrowStyleProp) {

  let dropdown = {
    backgroundColor,
    borderTop: 'none'
  };
  let ddLinkArrow = {
    display: 'inline-block',
    position: 'relative',
    fontSize: '0.8em',
    ...arrowStyleProp
  };
  
  if (isFullNavDisplayed) {
    Object.assign(dropdown, navShadow);
    ddLinkArrow.top = '0.115em'; // number comes from trial & error
  }
  else if (isDropdownActive) {
    dropdown.paddingTop = 0;
  }
  else {
    dropdown.display = 'none';
  }

  return {
    dropdownContainer: {
      backgroundColor
    },
    dropdownLink: {
      zIndex: 22 // must be greater than .navbar-dropdown Bulma z-idex of 20
    },
    ddLinkArrow,
    dropdown
  };
};