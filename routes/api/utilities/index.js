module.exports = {
  routeErrorHandlerFactory
}

function routeErrorHandlerFactory(responseObj) {
  return err => {
    if (!err) {
      console.log('No error object in routeErrorHandler. Unknown error.');
      err = { message: 'Unknown error.' };
    }
    if (!err.status) err.status = 500;
    if (!err.message) err.message = 'An unknown error has occurred.';
    responseObj.status(err.status).json({
      message: err.message,
      problems: err.problems || { unknown: true }
    });
    if (err.status === 500) throw err;
  };
}