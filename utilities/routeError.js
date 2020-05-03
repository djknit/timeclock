module.exports = {
  routeErrorHandlerFactory,
  errorHandlerMiddleware
};

function routeErrorHandlerFactory(responseObj) {
  return err => {
    if (!err) {
      console.log('No error object in routeErrorHandler. Unknown error.');
      err = { messages: ['Unknown error.'] };
    }
    let { status, messages, message, problems } = err;
    if (!status) status = 500;
    if (!messages) messages = [message || 'An unknown error has occurred.'];
    if (err.type === 'entity.parse.failed') {
      messages.unshift('Improperly formatted request.');
    }
    if (!problems) problems = message ? {} : { unknown: true };
    responseObj.status(status).json({ messages, problems, err });
    if (status === 500) throw err;
  };
}

// Source: https://stackoverflow.com/questions/53048642/node-js-handle-body-parser-invalid-json-error
function errorHandlerMiddleware(err, req, res, next) {
  const errorHandler = routeErrorHandlerFactory(res);

  if (err) {
    errorHandler(err);
    // console.error(err);
    return;
  }

  next();
}