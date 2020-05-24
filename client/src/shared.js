// Import resources shared between front and back ends via npm symlink.
// Export so they can be used throughout front end without needing to directly reference link. (This isn't necessary, but seems to make the most sense.)

import sharedResources from 'timeclock-shared-resources';

export default sharedResources;