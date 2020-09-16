import { backgroundColor, navShadow, depressedItemShadow } from '../style';

export default function getStyle(isFullNavDisplayed, isDropdownActive) {

  let dropdown = {
    backgroundColor,
    borderTop: 'none'
  };
  
  if (isFullNavDisplayed) {
    Object.assign(dropdown, navShadow);
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
    ddLinkArrow: {
      display: 'inline-block',
      position: 'relative',
      top: '.2em',
      fontSize: '.8em'
    },
    dropdown
  };
};