import * as Joi from "joi";

export const envValidationConfig = Joi.object({
  NODE_ENV: Joi.string().valid("development", "production", "test"),
  PORT: Joi.number().default(3000),
});

{
  "id": 120,
  "session": "120",
  "movies": [1, 2, 3],
  "md5": "asfasfaf"
}