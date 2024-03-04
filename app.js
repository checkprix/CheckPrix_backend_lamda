const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const {connectToDb,disconnectToDb} = require("./mongoConfig/connection");
// const session = require("express-session");
const cors = require("cors"); // add cors
const app = express();
const helmet = require("helmet");
const Multer = require('./providers/multer/multer')
require('dotenv').config()



//multer for file storage
const multer = new Multer().createStorage();

//middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  methods: ['GET', 'POST','PUT','PATCH','DELETE','OPTIONS'],
  credentials: true,
  origin:(process.env.DEVELOPMENT === 'true') ? process.env.LOCAL_ENV: process.env.PRO_ENV,
  allowedHeaders: ['Content-Type', 'Authorization','authHeader'],
  optionSuccessStatus:200
}))




 //mongoDB connection
 connectToDb();

//routes

app.use(require('./routes/register'));
app.use(require("./routes/login.Route"));
app.use(require('./routes/admin.Register.Route'))
app.use(require('./routes/admin.Login.Route'))
app.use(require('./routes/logout.Route'));
app.use("/api/blog",multer.single('file'),require("./routes/blog.Route"));
app.use("/api/favrouite",require("./routes/favrouite.Route"));
app.use("/api/products",multer.single('file'),require('./routes/products.Route'));
app.use("/api/search",require('./routes/search.Route'));
app.use("/api/pricedrop",require("./routes/priceDrop.Route"))
app.use("/api/changepassword",require("./routes/password.Route"));
app.use("/api/forgetPassword",require('./routes/Forget.Password.Route'));
app.use("/api/store",multer.single('file'),require('./routes/store.Service'));
app.use("/api/check",require("./routes/check.Route"));


module.exports = app;

// app.listen(process.env.PORT || 3000,()=>{
 
//   console.log('Litesing....!!!')
// })