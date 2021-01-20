export default function getStyle(styleProp) {
  console.log('style prop m title\n', styleProp)
  return {
    title: {
      fontWeight: 500,
      marginBottom: 10, // Matches Bulma .modal-card-body y-padding and my style for <Notification> margin-bottom
      ...styleProp
    }
  };
};
