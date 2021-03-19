export default function getStyle(messagesAreaMinHeight) {
  return {
    messagesArea: {
      minHeight: messagesAreaMinHeight,
      // overflow: 'auto' // <-- Removed to accomodate msg restore btn. Not sure of original purpose
    }
  };
};
