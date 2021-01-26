export * from '../style';

export default function getStyle(messagesAreaMinHeight) {
  return {
    extraPrecedingBody: {
      textAlign: 'right'
    },
    messagesArea: {
      minHeight: messagesAreaMinHeight,
      overflow: 'auto'
    }
  };
};
