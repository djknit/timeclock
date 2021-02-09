export * from '../style';

export default function getStyle(messagesAreaMinHeight) {
  return {
    topBodySection: {
      textAlign: 'right'
    },
    messagesArea: {
      minHeight: messagesAreaMinHeight,
      overflow: 'auto'
    }
  };
};
