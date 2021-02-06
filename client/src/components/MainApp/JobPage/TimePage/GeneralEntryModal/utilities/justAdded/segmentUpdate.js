import { findItemInArray } from '../../../utilities';
import { doesSegmentMatchInfo } from './elemental';

// note: `justAddedSegmentsInfo` probably only needs `created` and original `startTime` & `endTime` for each entry (not current value or `modified`)

/* need to add `{ dayId, weekId }` of updated segment(s) to `justAddedSegmentsInfo` if updated seg is on list.
  On every edit-segment success response:
    * Check if segment matches segmentInfo for any of the justAdded segmentInfos
      - if match:
        * copy info; replace `dayId` and `weekId` in copy; add copy to justAdded.
          ^ (not necessary if day is the same)
*/ 

// * * * NEW STRATEGY * * - see above^
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
