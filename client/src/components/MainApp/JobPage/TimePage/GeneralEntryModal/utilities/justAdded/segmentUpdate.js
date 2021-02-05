import { findItemInArray } from '../../../utilities';
import { doesSegmentMatchInfo } from './elemental';

function segInfoUpdaterFactory(justAddedSegmentsInfo, setJustAddedSegsInfo) {
  return function applySegUpdateToJustAdded(segToEdit, updatedSegments) {
    let _justAddedSegsInfo = [ ...justAddedSegmentsInfo ];
    // can get seg easily from `segmentToEdit`
    // find info for segToEdit in justAddedSegmentsInfo
      // remove old info entirely ^
    // add whole updatedSegments to justAddedSegmentsInfo
      // should look at the format of both as returned by server and ensure uniformity
    removeInfoForSegFromJustAdded(segToEdit, _justAddedSegsInfo);
    setJustAddedSegsInfo([ updatedSegments, ..._justAddedSegsInfo ]);
  }
}

function removeInfoForSegFromJustAdded(seg, justAddedSegmentsInfo) {
  findItemInArray(justAddedSegmentsInfo, _isInfoForSeg, true);
  function _isInfoForSeg(_info) {
    return doesSegmentMatchInfo(seg, _info);
  }
}