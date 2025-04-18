import Joi from "joi";

const validator = (schema) => (payload) =>
  schema.validate(payload, {
    abortEarly: false,
  });

const addToCartSchema = Joi.object({
  donationType: Joi.string().required(),
  recipientId: Joi.string().required(),
  donationTypeRef: Joi.string().required(),
  amount: Joi.number().positive().required(),
});

const updateAmountSchema = Joi.object({
  amount: Joi.number().positive().required(),
});

export const validateAddingCartItem = validator(addToCartSchema);
export const validateUpdatingAmount = validator(updateAmountSchema);
