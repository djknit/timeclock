import { doesSegmentMatchInfo } from './elemental';

function getUpdatedSegInfos(updatedSegs, justAddedSegInfos) {
  if (!updatedSegs || !justAddedSegInfos) return;
  
  let indexOfSegInfoForSeg = -1, updatedSegInfoDaysInfo;

  _getInfoForUpdatedSeg();
  if (!updatedSegInfoDaysInfo) return;

  updatedSegs.forEach(_addSegDayInfoToSegInfoDaysInfo);

  return _getUpdatedSegInfosArray();

  function _getInfoForUpdatedSeg() {
    for (const _i in justAddedSegInfos) {
      if (doesSegmentMatchInfo(updatedSegs[0], justAddedSegInfos[_i])) { // if multiple updatedSegs, they all have the same segmentInfo but different dayIds
        indexOfSegInfoForSeg = _i;
        updatedSegInfoDaysInfo = [ ...justAddedSegInfos[_i].days ];
      }
    }
  }
  function _addSegDayInfoToSegInfoDaysInfo(_seg) {
    const _getWkDayId = ({ dayId, weekId }) => `${weekId}${dayId}`;
    if (!updatedSegInfoDaysInfo.map(_getWkDayId).includes(_getWkDayId(_seg))) {
      updatedSegInfoDaysInfo.push({
        dayId: _seg.dayId,
        weekId: _seg.weekId
      });
    }
  }
  function _getUpdatedSegInfosArray() {
    let _updatedSegInfos = [ ...justAddedSegInfos ];
    _updatedSegInfos[indexOfSegInfoForSeg] = {
      ...justAddedSegInfos[indexOfSegInfoForSeg],
      days: updatedSegInfoDaysInfo
    };
    return _updatedSegInfos;
  }
}

export {
  getUpdatedSegInfos
};
