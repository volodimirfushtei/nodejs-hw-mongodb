// src/middlewares/validateBody.js

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
          errors: err.details.map((item) => ({ [item.path]: item.message })),
        },
      ),
    );
    next(error);
  }
};
