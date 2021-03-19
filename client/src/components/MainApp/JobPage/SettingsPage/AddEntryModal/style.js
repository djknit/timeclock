export default function getStyle(messageDivMinHeight) {
  const areaDiv = {
    // overflow: 'auto' // <-- Removed to accomodate msg restore btn. Not sure of original purpose
  };

  return {
    messagesArea: messageDivMinHeight ? (
      {
        ...areaDiv,
        minHeight: messageDivMinHeight
      }
    ) : (
      areaDiv
    ),
    firstInputArea: areaDiv,
    inputLabel: {
      textAlign: 'left'
    },
    firstInputField: {
      marginBottom: '.75rem' // matches Bulma style for .field:not(:last-child)
    }
  };
};
