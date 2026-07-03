const Joi = require("joi");
const { sendError } = require("../utils/response");

const validateUrl = (req, res, next)=>{

    const schema = Joi.object({
  originalUrl: Joi.string().uri().required()
});
const { error } = schema.validate(req.body);
if (error) {
  return sendError(res, error.details[0].message, 400);
}
next();

}

module.exports = {validateUrl}
