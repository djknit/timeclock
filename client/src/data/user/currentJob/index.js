import { dataServiceFactory } from '../../../utilities';
import timeService from './time';

let weeks = timeService.getValue();
timeService.subscribe(() => weeks = timeService.getValue());

let name, timezone, wage, dayCutoff, weekBegins, id;

const service = dataServiceFactory({
  readFunction: () => (
    id ?
    {} :
    null
  ),
  methods: {

  }
});

export default service;