export default function getStyle(isNotificationLastChild) {
  const allPs = {
    textAlign: 'center',
    lineHeight: 1.2
  };

  let style = {
    notification: {},
    p: {
      ...allPs,
      marginBottom: 10
    },
    lastP: {
      ...allPs,
      marginBottom: 0
    }
  };

  if (!isNotificationLastChild) {
    style.notification.marginBottom = 10;
  }

  return style;
};
