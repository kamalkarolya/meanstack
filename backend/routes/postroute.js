const express = require('express');
const route = express.Router();

const checkAuth = require("../middleware/checkAuth");
const controller = require("../controller/post");
const fileExtract = require("../middleware/file");

route.post('',checkAuth,fileExtract,controller.createPost );

route.put('/:id',checkAuth, fileExtract,controller.updatePost);

route.get('/:id',controller.fetchonePost );

route.get('',controller.fetchPost );

route.delete('/:id',checkAuth ,controller.deletePost );

module.exports = route;
