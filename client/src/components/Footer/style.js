import { footerHeight } from '../../AppStyle';

export default function getStyle() {
  const childDiv = {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 2
  };

  return {
    footer: {
      height: footerHeight,
      position: 'relative'
    },
    content: {
      ...childDiv,
      zIndex: 2,
      padding: 10
    },
    background: {
      ...childDiv,
      zIndex: 1,
      opacity: .1,
      backgroundColor: '#202020'
    }
  };
};