export default function getStyle(additionalStyle, isRadio, isInline, windowWidth) {
  return {
    control: {
      // next line: matches Bulma `.field-label.is-normal` style
      paddingTop: isRadio && isInline && windowWidth >= 769 ? '.375rem' : undefined,
      ...additionalStyle
    }
  };
}