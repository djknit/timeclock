import { backgroundColor, shadow } from '../style';

export default function getStyle(isFullNavDisplayed) {

  return {
    dropdownContainer: {
      backgroundColor
    },
    dropdownLink: {
      zIndex: 22 // must be greater than .navbar-dropdown Bulma z-idex of 20
    },
    dropdownArrow: {
      display: 'inline-block',
      position: 'relative',
      top: '.2em',
      fontSize: '.8em'
    },
    dropdown: {
      backgroundColor,
      ...(isFullNavDisplayed ? shadow(7) : { paddingTop: 0 }),
      borderTop: 'none'
    }
  };
};