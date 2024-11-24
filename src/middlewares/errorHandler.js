export function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).send({
    status: 500,
    message: 'Something went wrong',
    data: err,
  });
}
