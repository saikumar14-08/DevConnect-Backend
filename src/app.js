const adminCheck = require('./Middlewares/admin')

const express = require("express");

const app = express();

app.use('/admin',adminCheck)

app.get('/admin/addUser', (req,res) => {
  // let token = 'admin';
  console.log("This is admin/addUser");
  // if(token === 'admin') {
    res.send("Added user")
  // }
})
app.get('/admin/deleteUser', (req,res) => {
  // let token = 'admin';
  console.log("This is admin/deleteUser");
  // if(token === 'admin') {
    res.send("Deleted user")
  // }
})

app.get('/user', (req,res) => {
  console.log("This is User");
  res.send("This is User")  
})
app.post('/test',(req,res)=> res.send("Data posted successfully"));

app.patch('/test',(req,res)  => res.send("Data Patched successfully"));

app.delete('/test',(req,res)=> res.send("Data deleted successfully"))

// console.log("This is app.js");
app.listen(3000, () =>
  console.log("Server successfully listening to port 3000")
);