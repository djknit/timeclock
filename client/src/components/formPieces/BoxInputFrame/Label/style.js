export default function getStyle(styleProp, isRadio) {
  let labelStyle = { ...styleProp };
  if (isRadio) labelStyle.cursor = 'default';
  return {
    label: labelStyle,
    sublabel: {
      fontWeight: 'normal'
    }
  };
};
