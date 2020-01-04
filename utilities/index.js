module.exports = {
  routeErrorHandlerFactory,
  errorHandlerMiddleware
}

function routeErrorHandlerFactory(responseObj) {
  return err => {
    if (!err) {
      console.log('No error object in routeErrorHandler. Unknown error.');
      err = { message: 'Unknown error.' };
    }
    if (!err.status) err.status = 500;
    if (!err.message) err.message = 'An unknown error has occurred.';
    if (err.type === 'entity.parse.failed') {
      err.message = "Improperly formatted request. " + err.message;
    }
    responseObj.status(err.status).json({
      message: err.message,
      problems: err.problems || (err.message ? {} : { unknown: true }),
      err
    });
    // if (err.status === 500) throw err;
  };
}

// Source: https://stackoverflow.com/questions/53048642/node-js-handle-body-parser-invalid-json-error
function errorHandlerMiddleware(err, req, res, next) {
  const errorHandler = routeErrorHandlerFactory(res);

  if (err) {
    errorHandler(err);
    console.error(err);
    return;
  }

  next();
}