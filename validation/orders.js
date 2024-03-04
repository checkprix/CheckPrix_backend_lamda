const Joi = require('joi');


module.exports =(data)=>{
// Validation schema for the address object
const addressSchema = Joi.object({
  id:Joi.optional(),
  name: Joi.string().required(),
  phone: Joi.number().required(),
  address: Joi.string().required(),
  landmark: Joi.string().allow('').optional(),
  pincode: Joi.number().required(),
  colony: Joi.string().required(),
  city:Joi.string().required(),
  state: Joi.string().required(),
});

// Validation schema for price, quantity, and options fields
const priceSchema = Joi.number().required();
const quantitySchema = Joi.object().pattern(Joi.string(), Joi.number()).required();
const optionsSchema = Joi.object().required();

// Validation schema for the entire data model
const dataModelSchema = Joi.object({
  userId: Joi.string().required(),
  orderId: Joi.string().required(),
  address: addressSchema,
  price: priceSchema,
  quantity: quantitySchema,
  options: optionsSchema,
  status: Joi.string().required(),
  date:Joi.string().required()
});

// Sample data to validate
// const data = {
//   userId: "user123",
//   orderId: "order123",
//   address: {
//     name: "John Doe",
//     phoneNumber: "1234567890",
//     address: "123 Main Street",
//     landmark: "",
//     pincode: "12345",
//     colony: "Sample Colony",
//     state: "Sample State",
//   },
//   price: 100,
//   quantity: { apples: 2, oranges: 3 },
//   options: { option1: "A", option2: "B" },
//   status: "Pending",
// };

// Validate the sample data against the data model schema
const { error } = dataModelSchema.validate(data);

if (error) {
  console.error("Validation Error:", error.message);
  return false;
} else {
  console.log("Data is valid.");
  return true;
}
}