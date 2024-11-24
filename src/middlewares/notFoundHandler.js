import createHttpError from 'http-errors';
export function notFoundHandler(req, res, next) {
  const error = createHttpError(404, 'Route not found');
  res.status(error.status).send({
    message: error.message,
  });
}
