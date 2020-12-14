export default function getStyle(messagesAreaMinHeight) {
  return {
    messagesArea: {
      minHeight: messagesAreaMinHeight,
      overflow: 'auto'
    }
  };
};