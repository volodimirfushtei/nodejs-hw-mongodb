import createHttpError from 'http-errors';

export function errorHandler(err, req, res, next) {
  if (!err.status) {
    err = createHttpError(500, 'Something went wrong');
  }
  res.status(err.status).send({
    status: err.status,
    data: err,
  });
}
