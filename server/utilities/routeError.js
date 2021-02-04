module.exports = {
  routeErrorHandlerFactory,
  errorHandlerMiddleware,
  processErrorForRes
};

function routeErrorHandlerFactory(responseObj) {
  return err => {
    const { status, data } = processErrorForRes(err);
    responseObj.status(status).json(data);
    if (status === 500) throw err;
  };
}

// Source: https://stackoverflow.com/questions/53048642/node-js-handle-body-parser-invalid-json-error
function errorHandlerMiddleware(err, req, res, next) {
  const errorHandler = routeErrorHandlerFactory(res);

  if (err) {
    errorHandler(err);
    return;
  }

  next();
}

function processErrorForRes(err) {
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
  return {
    status,
    data: { messages, problems, err }
  };
}
