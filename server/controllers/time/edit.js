const {
  checkForFailure,
  findItemWithId
} = require('../utilities');
const {
  segments: segmentsCtrl,
  days: daysCtrl
} = require('../timePieces');
const WeekCtrl = require('../Week');

function editSegment(segId, weekId, dayId, userId, newTimes, fragments) {
  return new Promise((resolve, reject) => {
    if (fragments) {
      const hasOverlap = segmentsCtrl.doSegsOverlap([newTimes, ...fragments]);
      checkForFailure(hasOverlap, 'Overlapping fragments.', { fragments: true }, 422);
    }
    let segment;
    WeekCtrl.getById(weekId, userId)
    .then(weekDoc => {
      segment = findSegInWeek(weekDoc, segId, dayId);
      segment.modified.push({
        time: Date.now(),
        previousValue: {
          startTime: segment.startTime,
          endTime: segment.endTime
        },
        method: 'edit segment'
      });
      segment.startTime = newTimes.startTime;
      segment.endTime = newTimes.endTime;
      console.log('created\n', segment.created);
      console.log({ ...segment.created });
      console.log('modified\n', modified)
      console.log(modified.map(info => ({ ...info })));
      return segment.save();
    })
    .then(() => {
      resolve({ segment });
    });
    // get week document
      // find segment
      // get created & modified
      // update modified
    // attempt update of segment
      // make update fxn return full seg info, or pick it out from week
    // if no fragments, return
    // add created and modified data to each fragment
    // add fragments using addSegment in this (time) ctrl
      // catch err, check for error in result, and treat the same
  
  });
}

function findSegInWeek(weekDoc, segId, dayId) {
  if (!weekDoc) throw new Error('Week not found');
  const day = findItemWithId(dayId, weekDoc.days);
  if (!day) throw new Error('Day not found');
  const segment = findItemWithId(segId, day.segments);
  if (!segment) throw new Error('Segment not found');
  return segment;
}
