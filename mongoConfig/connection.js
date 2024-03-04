require('dotenv').config()
const mongoose = require("mongoose");
async  function connectToDb()
{
mongoose.set('strictQuery', true);

try{
  console.log('connected')
  await  mongoose.connect(
    (process.env.DEVELOPMENT === 'true')? process.env.MONGODBURL_DEVELOPMENT : process.env.MONGODBURL_PRODUCTION
    );

  return  mongoose.connection;
 
}
catch(err)
{
    console.log("Error : server is not connecting to database");
    console.log("error occured in the /mongoConfig/connectionJs");
    
    // write code that notify server has error in connecting with database
}
  
}


async function disconnectToDb()
{
  try{
    //console.log('disconntected')
    await  mongoose.connection.close();
    return mongoose.connection;
  }
  catch(err)
  {
      console.log("Error : server is not disconnecting to database");
      console.log("error occured in the /mongoConfig/connectionJs");
      
      // write code that notify server has error in connecting with database
  }
}


module.exports = {connectToDb,disconnectToDb}