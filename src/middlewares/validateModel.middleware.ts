import { Request, Response } from 'express';
import Joi from 'joi';

export default function modelValidation(model: Joi.ObjectSchema<any>) {
  return (req: Request, res: Response, next) => {
    const { error } = model.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(422).send(errors);
    }

    return next();
  };
}
