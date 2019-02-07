const pool = require('../config/database');


module.exports.adminDetails = (callback) =>{
  const qry = "select firstName, lastName,email,password,address,mobileNo from admin where adminID=1";
  pool.query(qry, (err,result) =>{
    if (err){
      return callback(err,null);
    }
    if(result){
      return callback(null,result[0]);
    }
  });
}

module.exports.editAdmin = (firstName,lastName,email,password,address,mobileNo, callback) => {

  const qry = "update admin set firstName=?,lastName=?,email=?,password=?,address=?,mobileNo=? where adminID=1 ";

  pool.query(qry,[firstName,lastName,email,password,address,mobileNo],(err,result) => {
    if (err){
      return callback(err,null);
    }
    else{
      return callback(null,true);
    }
  });
}

module.exports.catagoryList = (callback) =>{
  const qry = "select catagoryID,catagoryName from catagory";
  pool.query(qry, (err,result) =>{
    if (err){
      return callback(err,null);
    }else{
      return callback(null,result);
    }
  });
}

module.exports.saveCatagory = (catagoryName, callback) => {

  const qry1 = "select catagoryID from catagory where catagoryName=? ";
  const qry2 = "insert into catagory(catagoryName) values(?)"

  pool.query(qry1,[catagoryName],(err,result1) => {
    if (err){
      return callback(err,null);
    }
    if(result1[0]==null){
      pool.query(qry2,[catagoryName],(err,result2) => {
        if (err){
          return callback(err,null);
        }else{
          return callback(null,true); //catagory added succesfully
        }
      });

    }else{
        return callback(null,false); //catagory already exist
    }
  });
}

module.exports.productList = (catagoryID,callback) =>{
  const qry = "select productID,productName,price,qtyAvailable,purchaseAmount,description from product where catagoryID=?";
  pool.query(qry,[catagoryID], (err,result) =>{
    if (err){
      return callback(err,null);
    }else{
      return callback(null,result);
    }
  });
}

module.exports.saveProduct = (catagoryID,productName,price,qtyAvailable,description,imgDetail, callback) => {

  const qry1 = "select productID from product where productName=? ";
  const qry2 = "insert into product(catagoryID,productName,price,qtyAvailable,description) values(?,?,?,?,?)"

  pool.query(qry1,[productName],(err,result1) => {
    if (err){
      return callback(err,null);
    }
    if(result1[0]==null){
      pool.query(qry2,[catagoryID,productName,price,qtyAvailable,description],(err,result2) => {
        if (err){
          return callback(err,null);
        }else{
          return callback(null,true); //product added succesfully
        }
      });

    }else{
        return callback(null,false); //product already exist
    }
  });
}
