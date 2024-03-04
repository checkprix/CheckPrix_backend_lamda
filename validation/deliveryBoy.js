const Joi = require('joi');

module.exports =(data)=>{
    // Validation schema for the address object
    const deliveryBoySchema = Joi.object({
      name: Joi.string().required(),
      phone: Joi.string().length(10).required(),
      password:Joi.string().required(),
      colony:Joi.string().required(),
      aadhar:Joi.string().length(12).required(),
      address: Joi.string().required(),
      city: Joi.string().required()
    });
    
    
    // Validate the sample data against the data model schema
    const { error } = deliveryBoySchema.validate(data);
    
    if (error) {
      console.error("Validation Error:", error.message);
      return false;
    } else {
      console.log("Data is valid.");
      return true;
    }
}