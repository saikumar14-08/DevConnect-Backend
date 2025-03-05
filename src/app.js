
const express = require("express");

const app = express();

app.get('/test/:username/:passowrd',(req,res) => {
  console.log(req.params)
  res.send("This is test page");
})

app.post('/test',(req,res)=> res.send("Data posted successfully"));

app.patch('/test',(req,res)  => res.send("Data Patched successfully"));

app.delete('/test',(req,res)=> res.send("Data deleted successfully"))

console.log("This is app.js");

app.listen(3000, () =>
  console.log("Server successfully listening to port 3000")
);