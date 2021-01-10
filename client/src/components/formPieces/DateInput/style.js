export default function getStyle(labelStyle, fieldStyle) {
  return {
    // field: {
    //   zIndex: 2, // this line & next needed to prevent calendar dropdown from being covered
    //   position: 'relative'
    // }, // CORRECTION: above styles appear actually to not be needed at this time
    label: labelStyle,
    field: fieldStyle
  };
};