
const express = require("express");

const app = express();

app.listen(3000, () =>
  console.log("Server successfully listening to port 3000")
);

app.get('/',(req,res)=> {
  res.send("THis is Home page");
})

app.get('/test',(req,res) => {
  res.send("This is test page");
})

app.get("/hello",(req,res) => {
  res.send("This is Hello page")
})

console.log("This is app.js");