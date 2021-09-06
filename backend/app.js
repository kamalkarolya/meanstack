require('dotenv').config();
const express  = require("express");
const path = require('path');
const app = express();
const bodyParser  = require("body-parser");
const postRoute = require('./routes/postroute');
const userRoute = require('./routes/useroute');
const mongoose = require('mongoose');
const mongoPass = process.env.MONGO_PW;

mongoose.connect(`mongodb+srv://kamalkarolya:${mongoPass}@registration.bjkkk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`).then(()=>{
  console.log("Yay!!Connected to the Database");
}).catch(()=>{
  console.log("Sed,Connection Failed!!");
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use("/images",express.static(path.join("images")));
app.use(express.static(__dirname + '/dist/angular'));


app.use((req,res,next)=>{
  res.setHeader("Access-Control-Allow-Origin","*" );
  res.setHeader("Access-Control-Allow-Headers",
       "Origin, X-Requested-With,Content-Type,  Accept, Authorization" );
  res.setHeader("Access-Control-Allow-Methods",
       "GET , POST , PATCH, PUT ,  DELETE, OPTIONS" );
   next();
});

app.use("/api/posts",postRoute );
app.use("/api/user",userRoute );
app.use("/",(req,res,next)=>{
  // res.sendFile(path.join(__dirname+"angular"+"index.html"));
  res.sendFile(path.join(__dirname+'/dist/angular/index.html'));
})
module.exports = app;
