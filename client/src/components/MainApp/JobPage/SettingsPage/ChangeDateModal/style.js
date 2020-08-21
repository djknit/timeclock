export default function getStyle(messageDivMinHeight) {
  const areaDiv = { overflow: 'auto' };

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