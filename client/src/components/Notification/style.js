export default function getStyle() {
  const allPs = {
    textAlign: 'center',
    lineHeight: 1.2
  };

  return {
    notification: {
      marginBottom: 10
    },
    p: {
      ...allPs,
      marginBottom: 10
    },
    lastP: {
      ...allPs,
      marginBottom: 0
    }
  };
}