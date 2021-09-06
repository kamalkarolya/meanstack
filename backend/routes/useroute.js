const express = require('express');
const controller =  require("../controller/user");
const route = express.Router();

route.post('/signup',controller.createUser );

route.post('/login',controller.loginUser);
module.exports = route;
