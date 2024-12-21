import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    const error = createHttpError(
      400,
      JSON.stringify(
        'Bad Request: lenght mast be with min 3 & max 20 simbols  ',
        {
          errors: err.details.map((item) => ({
            field: item.path[0],
            message: item.message,
          })),
        },
      ),
    );
    next(error);
  }
};
export const validateBodyRequestResetPassword = (schema) => {};
