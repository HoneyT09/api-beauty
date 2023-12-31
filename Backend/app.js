const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
 
const mongoose = require('mongoose');
 
const postsRoutes = require('./routes/posts');
const usersRoutes = require('./routes/users')
 
const app = express();
mongoose.connect("mongodb+srv://torreshoney:HoneyL1309@cluster0.3wcp7kt.mongodb.net/node-angular").then(()=> {
    console.log('Base de datos conectada');
}).catch(()=> {
    console.log('Conexion Fallida');
});
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/image", express.static(path.join("backend/images")));
 
 
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept")
    
    res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    next();
});
 
app.use("/api/posts", postsRoutes);
app.use("/api/users", usersRoutes);
 
module.exports = app;