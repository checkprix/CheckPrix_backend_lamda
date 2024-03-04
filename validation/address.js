const Joi = require('joi');

module.exports =(data)=>{
    // Validation schema for the address object
    const addressSchema = Joi.object({
      name: Joi.string().required(),
      phone: Joi.string().length(10).required(),
      address: Joi.string().required(),
      landmark: Joi.string().allow('').optional(),
      pincode: Joi.string().length(6).required(),
      colony: Joi.string().required(),
      city:Joi.string().required(),
      state: Joi.string().required(),
      id:Joi.string().required()
    });
    
    
    // Validate the sample data against the data model schema
    const { error } = addressSchema.validate(data);
    
    if (error) {
    //  console.error("Validation Error:", error.message);
      return false;
    } else {
     // console.log("Data is valid.");
      return true;
    }
}