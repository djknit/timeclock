import { isWindowWide } from '../../style';

export default function getStyle(additionalStyle, isRadio, isInline, windowWidth) {
  return {
    control: {
      // next line: matches Bulma `.field-label.is-normal` style
      paddingTop: isRadio && isInline && isWindowWide(windowWidth) ? '.375rem' : undefined,
      ...additionalStyle
    }
  };
}