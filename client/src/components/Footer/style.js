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

  const contentPadding = `calc(${footerHeight / 2}px - .75em)`; // = (1/2) * (footerHeight - (lineHeight * fontSize))

  const textStyle = {
    display: 'inline-block',
    position: 'absolute'
  };

  return {
    footer: {
      height: footerHeight,
      position: 'relative'
    },
    content: {
      ...childDiv,
      zIndex: 2,
      padding: contentPadding,
      // color: '#000000',
      verticalAlign: 'middle'
    },
    leftText: {
      ...textStyle,
      left: contentPadding
    },
    rightText: {
      ...textStyle,
      right: contentPadding
    },
    background: {
      ...childDiv,
      zIndex: 1,
      opacity: .1,
      backgroundColor: '#202020'
    },
    linkStyles: {
      innate: {
        color: '#666666',
        textDecoration: 'none'
      },
      active: {
        color: '#efefef'
      },
      hover: {
        color: '#000000'
      },
      focus: {
        color: '#202020'
      }
    }
  };
};