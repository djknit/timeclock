import { textColor } from '../style';

export default function getStyle() {
  return {
    navItem: {
      verticalAlign: 'middle'
    },
    // NEEDS WORK (above + below): want to vertically center text but it's not working.
    welcomeText: {
      color: textColor,
      display: 'inline-block',
      verticalAlign: 'middle',
      height: '100%'
    },
    userName: {
      color: textColor
    },
    logoutButton: {
      innate: { marginLeft: 10 }
    }
  };
};