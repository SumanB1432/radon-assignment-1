let userModel  = require("../modules/userModule")
let uploadFile = require("../controller/awsController")
// let valiid = require("validator")
let jwt = require("jsonwebtoken")

const isValid = (value) => {
    if (typeof value === "undefined" ||  value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true
  }
  const isValidPassword = (password) => {
    if (password.length > 7 && password.length < 16) return true
  }
  let name_Regex = /^[a-zA-Z]+$/;



  let createUser = async function(req,res){
    try{
    let data = req.body;
    let file = req.files;
    let {fName,lName,email,password,phone} = data;
    
    if(Object.keys(data).length==0){
       return res.status(400).send({status:false,message:"You must enter data to create an account!"})
    }
    if(!isValid(fName)){
        return res.status(400).send({status:false,message:"FIRST NAME IS MANDETORY !"})
    }
    if(!name_Regex.test(fName)){
       return res.status(400).send({status:false,message:"Please provide a valid first name"})
    }

    if(!isValid(lName)){
       return res.status(400).send({status:false,message:"LAST NAME IS MANDETORY !"})
    }
    if(!name_Regex.test(lName)){
       return res.status(400).send({status:false,message:"Please provide a valid Last name"})
    }
    if (!isValid(email)) return res.status(400).send({ status: false, Message: "Please provide your email address" })

    if (!isValid(phone))
        return res.status(400).send({
            status: false,
            Message: "Please provide your phone number",
        })

    if (!isValid(password)) return res.status(400).send({ status: false, Message: "Please provide your password" })

    // if (!isValid(address)) return res.status(400).send({ status: false, Message: " Address must be provide" })

    let emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
    let phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/

    if (!email.trim().match(emailRegex))
        return res.status(400).send({ status: false, message: "Please enter valid email" })

    if (!phone.trim().match(phoneRegex))
        return res.status(400).send({ status: false, message: "Please enter valid pan -Indian phone number" })

    if (!isValidPassword(password))
        return res.status(400).send({
            status: false,
            message: "Please provide a valid password ,Password should be of 8 - 15 characters",
        })

    let getEmail = await userModel.findOne({email:email});
    if(getEmail != undefined){
       return res.status(400).send({status:false,message:"THIS EMAIL IS ALREADY EXIST"})
    }
    let getPhone = await userModel.findOne({phone:phone})
    if(getPhone!=undefined){
       return res.status(400).send({status:false,message:"This phone number already exixt"})
    }

    // let userPhoto = await uploadFile(file[0]);
    // console.log(userPhoto)

    let userData = {
        fName:fName,
        lName:lName,
        email:email,
        password:password,
        // photo:userPhoto
    }

    let user = await userModel.create(userData)
    if(user){
       return res.status(201).send({status:true,message:"Created Successfully",data:user})
    }
}
catch(err){
   return res.status(500).send({status:false,message:err.message})
}

}

let login = async function (req, res) {
    try {
  
      let data = req.body;
      const { email, password } = data;
  
      if (!Object.keys(data).length) {
        return res.status(400).send({ status: false, message: "email & password must be given" });
      }
      
      
      if (!isValid(email)) {
        return res.status(400).send({ status: false, messgage: "email is required " });
      }
  
  
      if (!isValid(password)) {
        return res.status(400).send({ status: false, messsge: "password is required" });
      }
  
      let checkedUser = await userModel.findOne({
        email: email,
        password: password,
      });
  
      if (!checkedUser) {
        return res.status(401).send({ status: false, message: "email or password is not correct" });
      }
     
  
      let date = Date.now();
      let createTime = Math.floor(date / 1000);
      let expTime = createTime + 3000;
  
      let token = jwt.sign(
        {
          userId: checkedUser._id.toString(),
          iat: createTime,
          exp: expTime,
        },
        "suman_whoAMi"
      );
  
      res.setHeader("x-api-key", token);
      return res.status(200).send({ status: true, message: "Success", data: { token: token } });
    } 
    catch (err) {
     return res.status(500).send({ status: false, message: err.message });
    }
  };

  module.exports.createUser = createUser;
  module.exports.login = login;
