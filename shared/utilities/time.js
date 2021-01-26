function doTimeSegmentsOverlap(seg_1, seg_2) {
  const {
    startTime: start_1,
    endTime: end_1
  } = seg_1;
  const {
    startTime: start_2,
    endTime: end_2
  } = seg_2;
  return (
    (start_1 <= start_2 && start_2 < end_1) ||
    (start_1 < end_2 && end_2 <= end_1) ||
    (start_2 <= start_1 && start_1 < end_2)
  );
}

module.exports = {
  doTimeSegmentsOverlap
};