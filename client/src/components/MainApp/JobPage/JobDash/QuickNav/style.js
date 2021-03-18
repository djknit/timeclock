import { contentAreaPadding, mainAreaPadding } from '../style';

export default function getStyle(buttonHeight, windowWidth, additionalAreaStyle) {

  const isButtonOnTitleLine = windowWidth > 448; // depends on 1st button & title sizes (measured manually)
  let titleStyle;
  if (buttonHeight && isButtonOnTitleLine) {
    titleStyle = {
      display: 'inline-block',
      paddingRight: contentAreaPadding,
      margin: 0,
      height: buttonHeight,
      lineHeight: `${buttonHeight}px`,
      verticalAlign: 'middle'
    };
  }

  return {
    contentArea: {
      paddingBottom: 0,
      paddingRight: 0,
      ...(additionalAreaStyle || {})
    },
    title: titleStyle,
    button: {
      innate: {
        marginRight: contentAreaPadding,
        marginBottom: contentAreaPadding
      }
    }
  };
};
