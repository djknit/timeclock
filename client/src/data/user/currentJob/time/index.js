import { dataServiceFactory } from '../../../../utilities';

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

  }
});

export default service;