import Joi from 'joi';

export const ResidentModel = Joi.object({
  name: Joi.string().min(3).required(),
});

export const HouseworkModel = Joi.object({
  name: Joi.string().min(5).required(),
  description: Joi.string().required(),
  date: Joi.date().required(),
});

export const HouseworkEditModel = Joi.object({
  name: Joi.string().min(5),
  description: Joi.string(),
  date: Joi.date(),
  responsible: Joi.number().min(1),
});
