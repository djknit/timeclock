export default function getStyle() {
  return {
    field: {
      zIndex: 2, // this line & next needed to prevent calendar dropdown from being covered
      position: 'relative'
    }
  };
};