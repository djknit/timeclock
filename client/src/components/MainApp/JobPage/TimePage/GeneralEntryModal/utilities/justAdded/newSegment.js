function getSegInfoForNewSegs({ newSegmentInfo, newSegmentsInfo }) {
  let newSegs = newSegmentsInfo || [newSegmentInfo];
  return newSegs.map(getSegInfoForNewSeg);
}

function getSegInfoForNewSeg({ startTime, endTime, dayId, weekId, created }) {
  return {
    startTime,
    endTime,
    days: [{ dayId, weekId }],
    created
  };
}

export {
  getSegInfoForNewSegs
};
