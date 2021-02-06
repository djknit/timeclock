import { findItemInArray } from '../../../utilities';
import { doesSegmentMatchInfo } from './elemental';

function segInfoUpdaterFactory(justAddedSegmentsInfo, setJustAddedSegsInfo) {
  return function applySegUpdateToJustAdded(updatedSegments) {
    updatedSegments.forEach(updatedSeg => {
      const segInfo = findInfoForSeg(updatedSeg, justAddedSegmentsInfo);
      if (!segInfo) return;
      addDayAndWeekIdsToSegInfo(segInfo, updatedSeg);
    });
    let _justAddedSegsInfo = [ ...justAddedSegmentsInfo ];
    setJustAddedSegsInfo([ updatedSegments, ..._justAddedSegsInfo ]);
  };
}

function findInfoForSeg(seg, segsInfo) {
  for (const segInfo of segsInfo) {
    if (doesSegmentMatchInfo(seg, segInfo)) {
      return segInfo;
    }
  }
}

function addDayAndWeekIdsToSegInfo(segInfo, ids) {
  for (const { dayId, weekId } of segInfo.days) {
    if (ids.dayId === dayId && ids.weekId === weekId) {
      return;
    }
  }
  segInfo.days.push(ids);
}

export {
  segInfoUpdaterFactory
};
