let express = require("express");
let app = express();
let mongoose = require("mongoose");
let bodyPaser = require("body-parser");
let multer = require("multer");
let route= require("./routes/route")

app.use(bodyPaser.json());
app.use(multer().any());

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://Suman-1432:Suman1432@cluster0.bkkfmpr.mongodb.net/ASSIGNMENT-1",{
    useNewUrlParser:true
}).then((res)=>{
    console.log("Mongo DB is connected successfully")
}).catch((err)=>{
    console.log(err)
})


app.use("/",route)

let port = 5000;
app.listen(port,(err)=>{
    if(!err){
        console.log(`Connected to port no ${port}`)
    }
    else{
        console.log("ERROR ")
    }
})
