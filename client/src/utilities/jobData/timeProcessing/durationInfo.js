import { constants } from '../../constants';

const { secsPerMin, minsPerHr } = constants;

const secsPerHr = secsPerMin * minsPerHr;

export { getDurationInfo };


function getDurationInfo(durationInMsec) {
  const durationInSeconds = Math.round(durationInMsec / 1000);
  return {
    hours: Math.floor(durationInSeconds / secsPerHr),
    minutes: Math.floor(durationInSeconds / secsPerMin) % minsPerHr,
    seconds: durationInSeconds % secsPerMin,
    durationInMsec,
    durationInHours: durationInSeconds / secsPerHr
  };
}
