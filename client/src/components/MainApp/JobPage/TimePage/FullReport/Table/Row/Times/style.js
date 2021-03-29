export default function getStyle() {
  
  const dateTextStyle = {
    display: 'inline-block',
    // width: ? ? ?,
  };

  return {
    startTime: {
      ...dateTextStyle,
      textAlign: 'right'
    },
    endTime: {
      ...dateTextStyle,
      textAlign: 'left'
    }
  };
};
