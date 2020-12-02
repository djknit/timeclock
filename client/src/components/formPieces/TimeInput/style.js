export default function getStyle(labelStyle, fieldStyle) {
  return {
    field: {
      ...fieldStyle
    },
    label: {
      ...labelStyle
    }
  };
};
