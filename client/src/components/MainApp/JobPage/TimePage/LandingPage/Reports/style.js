export default function getStyle(additionalStyle) {

  return {
    contentArea: {
      ...additionalStyle,
      position: 'relative'
    }
  };
};
