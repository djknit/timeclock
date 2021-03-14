/*
ABOUT THIS FILE/FOLDER:
  These are the general methods invoked by the `/time/` api routes.
  This controller doesn't correspond to a specific model. The methods affect multiple models.
  This controller invokes other controllers rather than referencing the models directly.
*/

module.exports = {
  ...require('./remove'),
  ...require('./add'),
  ...require('./edit')
};
