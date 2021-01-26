// This file imports the utilities needed from the shared resources imported via sim-link of `shared`.
// The exports from this file will be used in their respective files in this folder (when files exist).
// These exports should NOT be used directly by the `index.js` file in this folder, EXCEPT when no such file exists.

import sharedResources from '../shared';

const { jobData, dates, time } = sharedResources.utilities;

export {
  jobData,
  dates,
  time
};
