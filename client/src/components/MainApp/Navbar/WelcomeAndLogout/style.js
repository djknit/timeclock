import { textColor } from '../style';

export default function getStyle() {
  return {
    navItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    welcomeText: {
      color: textColor
    },
    logoutButton: {
      innate: { marginLeft: 10 }
    }
  };
};