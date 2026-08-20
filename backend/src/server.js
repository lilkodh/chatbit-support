const express = require("express");
const sequelize = require("./config/database");
const app = require("./app")
require("dotenv").config();


const PORT = process.env.PORT||3000;
const startServer = async () => {
 try{
   await sequelize.authenticate();
   console.log("database is connected done hahaha");
   app.listen(PORT, () => { console.log(`the server is running in the port ${PORT}`)});


 }catch(err){
console.error("Database connection is failed ", err);
 }

};
startServer();