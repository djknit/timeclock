export default function getStyle(labelStyle, fieldStyle) {
  return {
    field: {
      zIndex: 2, // this line & next needed to prevent calendar dropdown from being covered
      position: 'relative'
    },
    label: labelStyle,
    field: fieldStyle
  };
};