export default function getStyle(isLastSection, inputFieldMarginBottom, sectionLabelMarginBottom) {

  const fieldNotLastStyle = {
    marginBottom: inputFieldMarginBottom
  };
  
  return {
    sectionLabelArea: {
      marginBottom: sectionLabelMarginBottom
    },
    field: fieldNotLastStyle,
    timeField: isLastSection ? {} : fieldNotLastStyle
  };
};
