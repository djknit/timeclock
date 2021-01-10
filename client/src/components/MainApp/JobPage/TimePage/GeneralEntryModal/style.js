export default function getStyle(messagesAreaMinHeight) {
  return {
    messagesArea: {
      minHeight: messagesAreaMinHeight,
      overflow: 'auto'
    },
    title: {
      marginBottom: 10,
      textDecoration: 'underline',
      // fontWeight: 600
    }
  };
};