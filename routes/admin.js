const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/adminQuery');
const Token = require('../config/token');
const jwt = require('jsonwebtoken');

//view admin profile AND send details to edit admin profile----(admin/profile)
router.get('/profile',Token.verifyToken,(req,res) =>{
  jwt.verify(req.token, 'mySecret', (err, decodeData) =>{
    if(err){

      res.status(403).json({data:"forbidden"})
    }else{

      User.adminDetails((err,result) =>{
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

//edit admin profile ----(admin/profile)
router.put("/profile",Token.verifyToken,(req,res) => {
  jwt.verify(req.token, 'mySecret', (err, decodeData) =>{
    if(err){
      res.status(403).json({data:"forbidden"})
    }else{

    //  const adminID=decodeData.userData.adminID;

      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      const email = req.body.email;
      const password = req.body.password;
      const address = req.body.address;
      const mobileNo = req.body.mobileNo;
      //console.log(pass);

      User.editAdmin(firstName,lastName,email,password,address,mobileNo, (err,result)=>{
        if(err){
          console.log(err);
        }else{
          console.log("profile updated successfully");
        return  res.status(200).json({message:"profile updated successfully"});

        }
      });

    }
  })
});

//get catagory list (admin/catagory)
router.get('/catagory',Token.verifyToken,(req,res) =>{
  jwt.verify(req.token, 'mySecret', (err, decodeData) =>{
    if(err){

      res.status(403).json({data:"forbidden"})
    }else{

      User.catagoryList((err,result) =>{
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

//add new catagory ----(admin/addCatagory)
router.post('/addCatagory',Token.verifyToken,(req,res) =>{
  jwt.verify(req.token, 'mySecret', (err, decodeData) =>{
    if(err){

      res.status(403).json({data:"forbidden"})
    }else{
      const catagoryName = req.body.catagoryName;

      User.saveCatagory(catagoryName, (err,result)=>{
        if(err){
          console.log(err);
        }
        if(result==false){
            return res.status(400).json({message:"catagory already exist"});
        }else{
          return res.status(200).json({message:"catagory added succesfully"});
        }
      })
    }
  });
});

//get all products' details id=catagoryID  ----(admin/products/:id)
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

//add new product  id=catagoryID ----(admin/addProduct/:id)
router.post('/addProduct/:id',Token.verifyToken,(req,res) =>{
  jwt.verify(req.token, 'mySecret', (err, decodeData) =>{
    if(err){

      res.status(403).json({data:"forbidden"})
    }else{
      const catagoryID = req.params.id;
      const productName = req.body.productName;
      const price = req.body.price;
      const qtyAvailable = req.body.qtyAvailable;
      const description = req.body.description;
      const imgDetail = "imageDetails";

      User.saveProduct(catagoryID,productName,price,qtyAvailable,description,imgDetail, (err,result)=>{
        if(err){
          console.log(err);
        }
        if(result==false){
            return res.status(400).json({message:"product already exist"});
        }else{
          return res.status(200).json({message:"product added succesfully"});
        }
      })
    }
  });
});

//send product details to edit product
router.get("/editProduct/:id",Token.verifyToken,(req,res) => {
  jwt.verify(req.token, 'mySecret', (err, decodeData) =>{
    if(err){
      res.status(403).json({data:"forbidden"})
    }else{

      const productID = req.params.id;

      User.getProduct(productID, (err,result)=>{
        if(err){
          console.log(err);
        }else{
        console.log(result);
        return  res.status(200).json({result});

        }
      });

    }
  })
});

//edit products --(admin/editProduct/:id)
router.put("/editProduct/:id",Token.verifyToken,(req,res) => {
  jwt.verify(req.token, 'mySecret', (err, decodeData) =>{
    if(err){
      res.status(403).json({data:"forbidden"})
    }else{

      const productID = req.params.id;
      const addQty = req.body.addQty;
      const productName = req.body.productName;
      const price = req.body.price;
      const description = req.body.description;
      const imgDetail =  "image details"   //req.body.imgDetail;


      User.editProduct(productID,addQty,productName,price,description,imgDetail, (err,result)=>{
        if(err){
          console.log(err);
        }else{
          console.log("product edited succesfully");
        return  res.status(200).json({message:"product edited succesfully"});

        }
      });

    }
  })
});

//get feedback id=productID
router.get('/feedback/:id',Token.verifyToken,(req,res) =>{
  jwt.verify(req.token, 'mySecret', (err, decodeData) =>{
    if(err){
      res.status(403).json({data:"forbidden"})
    }else{
      const productID = req.params.id;
      //console.log(productID);
      User.feedbacks(productID,(err,result) =>{
        if(err){
          console.log("err");
        }
        else{
          console.log(result);
        return  res.status(200).json({result});

        }
      });
    }
  });
});

//delete product  ---(admin/deleteProduct/:id)
router.get('/deleteProduct/:id',Token.verifyToken,(req,res) =>{
  jwt.verify(req.token, 'mySecret', (err, decodeData) =>{
    if(err){
      res.status(403).json({data:"forbidden"})
    }else{
      const productID = req.params.id;
      //console.log(productID);
      User.deleteProduct(productID,(err,result) =>{
        if(err){
          console.log(err);
        }
        else{
          console.log("deleted succcesfully");
        return  res.status(200).json({message:"product deleted succesfully"});

        }
      });
    }
  });
});


module.exports = router;
