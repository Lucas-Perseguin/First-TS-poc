import Joi from 'joi';

export const ResidentModel = Joi.object({
  name: Joi.string().min(3).required(),
});
