const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userQuery');
const Token = require('../config/token');
const jwt = require('jsonwebtoken');

//registering the user ----(user/register)
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

//login both user and admin---(user/login)
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

//user home -------(user/home)
router.get('/home',Token.verifyToken,(req,res) =>{
    jwt.verify(req.token, 'mySecret', (err, decodeData) =>{
      if(err){
        res.status(403).json({data:"forbidden"})
      }else{
        const firstName = decodeData.userData.firstName;

        User.getCatagories((err,result)=>{
          if(err){
            console.log(err);
          }else{
            //console.log(result);
            result[0].userName=firstName;
            console.log(result);
            return res.status(200).json({result}); //first name is sent along with result[0] catagory
          }
        });

      }
    });
  });

//user profile view and for editing details----(user/profile)
router.get('/profile',Token.verifyToken,(req,res) =>{
    jwt.verify(req.token, 'mySecret', (err, decodeData) =>{
      if(err){
        res.status(403).json({data:"forbidden"})
      }else{
        const firstName = decodeData.userData.firstName;
        const lastName = decodeData.userData.lastName;
        const email = decodeData.userData.email;
        const password = decodeData.userData.password;
        const address = decodeData.userData.address;
        const mobileNo = decodeData.userData.mobileNo;

      return  res.status(200).json({firstName,lastName,email,password,address,mobileNo});

      }
  });
});

//edit user profile ---(user/profile)
router.put('/profile',Token.verifyToken,(req,res) =>{
    jwt.verify(req.token, 'mySecret', (err, decodeData) =>{
      if(err){
        res.status(403).json({data:"forbidden"})
      }else{
          const userID = decodeData.userData.userID;
          const firstName = req.body.firstName;
          const lastName = req.body.lastName;
          var password = req.body.password;
          const address = req.body.address;
          const mobileNo = req.body.mobileNo;

          bcrypt.genSalt(10,(err,salt) =>{
            bcrypt.hash(password,salt, (err,hash) =>{
              if(err) throw err;

              password = hash;

                User.editUser(userID,firstName,lastName,password,address,mobileNo, (err,result)=>{
                  if(err){
                    console.log(err);
                  }else{
                    return res.status(200).json({message:"user profile updated succesfully"});
                  }
                });
              });
            });
      }
  });
});

//get all products of the catagory ---(user/products/:id)
router.get('/products/:id',Token.verifyToken,(req,res) =>{
  jwt.verify(req.token, 'mySecret', (err, decodeData) =>{
    if(err){

      res.status(403).json({data:"forbidden"})
    }else{
      const catagoryID = req.params.id;

      User.productList(catagoryID,(err,result) =>{
        if(err){
          console.log(err);
        }
        if(result){
          console.log(result);
        return  res.status(200).json({result});

        }
      });
    }
  });
});

//add item to cart ---(user/addCart/:id)
router.post('/addCart',Token.verifyToken,(req,res) =>{
  jwt.verify(req.token, 'mySecret', (err, decodeData) =>{
    if(err){

      res.status(403).json({data:"forbidden"})
    }else{
      const userID = decodeData.userData.userID;
      const productName = req.body.productName;
      const price = req.body.price;
      const amount = req.body.amount;
      const imgDetail = "imageDetails"; //req.body.imgDetail;

      User.addToCart(userID,productName,price,amount,imgDetail, (err,result) =>{
        if(err){
          console.log(err);
        }
        if(result==true){
          //console.log(result);
        return  res.status(200).json({message:"item added to cart succesfully"});
      }else{
        return  res.status(400).json({message:"item already added to your cart"});
      }
      });
    }
  });
});

//feedback of user ---(user/feedback/:id)
router.post('/feedback/:id',Token.verifyToken,(req,res) =>{
  jwt.verify(req.token, 'mySecret', (err, decodeData) =>{
    if(err){
      res.status(403).json({data:"forbidden"});
    }else{
      const productID = req.params.id;
      const customerName = decodeData.userData.firstName;
      const comment =req.body.comment;

        User.addFeedback(productID,customerName,comment, (err,result)=>{
          if(err){
            console.log(err);
          }else{
            return res.status(200).json({message:"feedback submitted succesfully"});
          }
        });

    }
  });
});

//get products in the cart ---(user/viewCart)
router.get('/viewCart',Token.verifyToken,(req,res) =>{
  jwt.verify(req.token, 'mySecret', (err, decodeData) =>{
    if(err){

      res.status(403).json({data:"forbidden"})
    }else{
      const userID = decodeData.userData.userID;

      User.viewCart(userID, (err,result)=>{
        if(err){
          console.log(err);
        }else{
          console.log(result);
          return res.status(200).json({result});
        }
      });
    }
  });
});

//delete cartItem id=cartID --(user//deleteCart/:id)
router.get('/deleteCart/:id',Token.verifyToken,(req,res) =>{
  jwt.verify(req.token, 'mySecret', (err, decodeData) =>{
    if(err){
      res.status(403).json({data:"forbidden"})
    }else{
      const cartID = req.params.id;
      //console.log(productID);
      User.deleteCartItem(cartID,(err,result) =>{
        if(err){
          console.log(err);
        }
        else{
          console.log("deleted succcesfully");
        return  res.status(200).json({message:"Item deleted from cart succesfully"});

        }
      });
    }
  });
});

//pay for cart items id=cartID --(user/pay/:id)
router.post('/pay/:id',Token.verifyToken,(req,res) =>{
  jwt.verify(req.token, 'mySecret', (err, decodeData) =>{
    if(err){
      res.status(403).json({data:"forbidden"})
    }else{
      const cartID = req.params.id;
      const userID = decodeData.userData.userID;
      const cardNumber =req.body.cardNumber;
      const expDate = req.body.expDate;
      
      User.payment(cartID,userID,cardNumber,expDate, (err,result) =>{
        if(err){
          console.log(err);
        }
        else{
          console.log("Payment succcesfull");
        return  res.status(200).json({message:"Payment succesfull"});

        }
      });
    }
  });
});

module.exports = router;
