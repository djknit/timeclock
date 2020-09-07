import { backgroundColor, shadow } from '../style';

export default function getStyle() {
  return {
    dropdownContainer: {
      backgroundColor,
    },
    dropdownLink: {
      zIndex: 22 // must be greater than .navbar-dropdown Bulma z-idex of 20
    },
    dropdown: {
      backgroundColor,
      ...shadow(7),
    }
  };
};