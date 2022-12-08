const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fName:{
    type:String,
    required:true,
    trim:true

  },
  lName:{
    type:String,
    required:true,
    trim:true
  },
  email:{
    required:true,
    type:String,
    trim:true,
    unique:true
  },
  password:{
    required:true,
    type:String,
    trim:true
  }
  // photo:{
  //   type:String,
  //   requires:true
  // }

})
module.exports = mongoose.model("User",userSchema)