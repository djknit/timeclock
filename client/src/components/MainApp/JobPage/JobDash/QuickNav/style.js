import { contentAreaPadding, mainAreaPadding } from '../style';

export default function getStyle(buttonHeight, additionalAreaStyle) {

  return {
    contentArea: {
      paddingBottom: 0,
      paddingRight: 0,
      ...(additionalAreaStyle || {})
    },
    title: {
      display: 'inline-block',
      paddingRight: contentAreaPadding,
      margin: 0,
      ...(
        buttonHeight ?
        {
          height: buttonHeight,
          lineHeight: `${buttonHeight}px`
        } :
        {}
      )
    },
    button: {
      innate: {
        marginRight: contentAreaPadding,
        marginBottom: contentAreaPadding
      }
    }
  };
};