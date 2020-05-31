export default function getStyle(additionalStyle, isRadio, windowWidth) {
  return {
    control: {
      paddingTop: isRadio && windowWidth >= 769 ? '.375rem' : undefined, // matches Bulma `.field-label.is-normal` style
      ...additionalStyle
    }
  };
}