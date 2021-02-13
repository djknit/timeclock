import { createAxiosInstance } from './elemental';

const timeAxios = createAxiosInstance('time');

const timeApi = {
  addSegmentToDay({
    segment: { startTime, endTime }, // inner destructure is for autocomplete when using this method
    dayId,
    weekId
  }) {
    const segment = { startTime, endTime };
    return timeAxios.post('/add-segment-to-day', { segment, dayId, weekId });
  },
  addSegment({
    segment: { startTime, endTime }, // inner destructure is for autocomplete when using this method
    jobId
  }) {
    const segment = { startTime, endTime };
    return timeAxios.post('/add-segment', { segment, jobId });
  },
  addSegments({ segments, jobId }) {
    return timeAxios.post('/add-segments', { segments, jobId });
  },
  deleteSegment({ segmentId, weekId, dayId }) {
    return timeAxios.post('/delete-segment', { segmentId, weekId, dayId });
  },
  deleteSegmentsForDateRange({ firstDate, lastDate, jobId }) {
    return timeAxios.post('/delete-segments-for-date-range', { firstDate, lastDate, jobId });
  },
  deleteSegmentsForDayIds({ ids, jobId }) {
    return timeAxios.post('/delete-segments-for-day-ids', { ids, jobId });
  },
  editSegment({ segmentId, weekId, dayId, updatedTimes, fragments }) {
    return timeAxios.post('/edit-segment', { segmentId, weekId, dayId, updatedTimes, fragments });
  }
};

export default timeApi;