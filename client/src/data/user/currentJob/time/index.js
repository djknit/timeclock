import { dataServiceFactory } from '../../../utilities';

let weeks;

const service = dataServiceFactory({
  readFunction: () => (
    weeks && weeks.map(
      ({ firstDateUtcTime, lastDateUtcTime, document }) => ({
        firstDateUtcTime,
        lastDateUtcTime,
        document: {

        }
      })
    )
  ),
  methods: {
    setWeeks: _weeks => {
      weeks = _weeks;
    },
    clearWeeks: () => {
      weeks = undefined;
    }
  }
});

export default service;