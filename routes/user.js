const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/adminQuery');
const Token = require('../config/token');
const jwt = require('jsonwebtoken');

//registering the company
router.post("/register", (req,res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email =req.body.email;
    var password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const address =req.body.address;
    const mobileNo =req.body.mobileNo;

    if(password.length < 8){
      console.log("password do not match");
      return res.status(402).json({message:"password must more than 8 charactors"});
    }
    if(password != confirmPassword){
      console.log("password do not match");
      return res.status(400).json({message:"password do not match"});
    }
    else{
      User.checkEmail(email, (err, result) =>{
        if(err) {
          console.log(err);
        }
        if(result ==true){
          res.status(403).json({message :"Email already registered"});
        }else{
            bcrypt.genSalt(10,(err,salt) =>{
              bcrypt.hash(password,salt, (err,hash) =>{
                if(err) throw err;
               password = hash;

               //save data in to the database
               User.saveUser(firstName,lastName,email,password,address,mobileNo, (err, result)=>{
                 if(err){
                   console.log(err);
                 }
                 else{
                    res.status(200).json({message :"user registered successfully"});
                 }
               });
              });
            });

          }
      });
    }
  })


//login both user and admin
router.post("/login", (req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email);

 User.findUser(email,password, (err,userData) =>{
   if(err){
   console.log(err);
    }

   if(userData ==null){
     return res.status(404).json({ data : "No user found"});

   }
   if(userData.data){
    return res.status(400).json({data :"password did not match"});
   }

   else{
       //console.log(userData.userType);
     //load the relevant profile of the user or admin
     jwt.sign({userData},'mySecret',{ expiresIn: '24h' }, (err,token)=>{
       if(err){
         console.log(err);
       }
          if(token){

                if(userData.userType==1){
                  console.log(userData);
                return res.status(200).json({token, userType:1}); //Admin
                }
                if(userData.userType==2){
                  return res.status(200).json({token, userType:2}); //user
                }else{
                    console.log("no user");
                  }

          }else{
            console.log("error creating token");
          }
      });
    }
 });
});



module.exports = router;
