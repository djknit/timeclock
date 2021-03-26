export default function getStyle(messageDivMinHeight) {
  const areaDiv = {
    // overflow: 'auto' // <-- Removed to accomodate msg restore btn. Not sure of original purpose
  };

  return {
    label: {
      textAlign: 'left'
    },
    messagesArea: messageDivMinHeight ? (
      {
        ...areaDiv,
        minHeight: messageDivMinHeight
      }
    ) : (
      areaDiv
    )
  };
}
