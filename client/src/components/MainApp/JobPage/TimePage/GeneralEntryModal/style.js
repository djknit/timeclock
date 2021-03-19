export * from '../style';

export default function getStyle(messagesAreaMinHeight) {
  return {
    topBodySection: {
      textAlign: 'right'
    },
    messagesArea: {
      minHeight: messagesAreaMinHeight,
      // overflow: 'auto' // <-- Removed to accomodate msg restore btn. Not sure of original purpose
    }
  };
};
