const pool = require('../config/database');
const bcrypt = require('bcryptjs');


//checkEmail - Email alredy registered or not ---rout(user/register)
module.exports.checkEmail =(email, callback) =>{
  const qry = "select userID from user where email=?";

  pool.query(qry,[email], (err,result) => {
    if (err){
      return callback(err,null);
    }
    if(result[0]==null){
          return  callback(null,false);    //email not registered
        }else{
          return callback(null,true);  //email already regisred
        }
      });
}

//save the user ---(user/register)
module.exports.saveUser =(firstName,lastName,email,password,address,mobileNo, callback) =>{
  const qry = "insert into user (firstName,lastName,email,password,address,mobileNo) values (?,?,?,?,?,?)";

  pool.query(qry,[firstName,lastName,email,password,address,mobileNo], (err,result) => {
    if (err){
      return callback(err,null);
    }else{
      return callback(null,true);
    }
  });

}

//find user type and send relavant data-- (user/login)
module.exports.findUser = (email,password,callback) => {
  const qry1 = "select adminID,firstName,lastName,email,password,address,mobileNo from admin where email=? AND password=? ";
  const qry2 = "select userID,firstName,lastName,email,password,address,mobileNo from user where email=?";

  pool.query(qry1,[email,password],(err,result1) =>{
    if(err) {
      return callback(err,null);
    }
    if(result1[0]==null){
      console.log("here");
      pool.query(qry2,[email],(err,result2) =>{
        if(err) {
          return callback(err,null);
        }
        if(result2[0]==null){
          return callback(null,null);
        }else{
          //check password
          var encPass=result2[0].password;
          bcrypt.compare(password, encPass, function(err, res) {
            if(err){
              return callback(err,null);
            }
            if(res==true){
              //password mtached
              result2[0].userType=2;
              return callback(null,result2[0]);  //user
            }
            if(res==false){
              //password do not match
              return callback(null,{"data":"password do not macth"});
            }
          });

        }
      });
    } else{
      //console.log(result1);
      result1[0].userType=1;
      return callback(null,result1[0]);  //admin
    }
  });
}

module.exports.getCatagories =(callback) =>{
  const qry = "select catagoryID,catagoryName from catagory ";

  pool.query(qry, (err,result) => {
    if (err){
      return callback(err,null);
    } else{
      return callback(null,result);
    }
  });
}

module.exports.editUser = (userID,firstName,lastName,password,address,mobileNo, callback) => {
  const qry = "update user set firstName=?,lastName=?,password=?,address=?,mobileNo=? where userID=? ";

      pool.query(qry,[firstName,lastName,password,address,mobileNo,userID],(err,result) => {
        if (err){
          return callback(err,null);
        }
        else{
          return callback(null,true);
        }
      });
}

module.exports.productList = (catagoryID,callback) =>{
  const qry = "select productID,productName,price,description from product where catagoryID=?";
  pool.query(qry,[catagoryID], (err,result) =>{
    if (err){
      return callback(err,null);
    }else{
      return callback(null,result);
    }
  });
}

module.exports.addToCart = (userID,productName,price,amount,imgDetail, callback) => {
  const qry1 = "select cartID from cart where userID=? AND productName=?";
  const qry2 = "insert into cart(userID,productName,totalPrice,amount,imgDetail) values(?,?,?,?,?) ";
  const totalPrice =price*amount;

    pool.query(qry1,[userID,productName],(err,result1)=>{
      if(err){
        return callback(err,null);
      }
      if(result1[0]==null){
        pool.query(qry2,[userID,productName,totalPrice,amount,imgDetail],(err,result2) => {
          if (err){
            return callback(err,null);
          }
          else{
            return callback(null,true);
          }
        });

      }else{
        return callback(null,false); //item already added to the cart
      }
    });
}

module.exports.addFeedback =(productID,customerName,comment, callback) =>{
  const qry = "insert into feedback(productID,customerName,comment) values (?,?,?)";

  pool.query(qry,[productID,customerName,comment], (err,result) => {
    if (err){
      return callback(err,null);
    }else{
      return callback(null,true);
    }
  });

}

module.exports.viewCart =(userID, callback) =>{
  const qry = "select cartID,dateAdded,productName,totalPrice,amount,imgDetail from cart where userID=?";

  pool.query(qry,[userID], (err,result) => {
    if (err){
      return callback(err,null);
    }else{
      return callback(null,result);
    }
  });

}

module.exports.deleteCartItem = (cartID, callback) =>{
  const qry = "delete from cart where cartID=?";

  pool.query(qry,[cartID], (err,result) =>{
    if (err){
      return callback(err,null);
    }else{
      return callback(null,true);
    }
  });
}

module.exports.payment = (cartID,userID,cardNumber,expDate, callback) =>{
  const qry1 = "delete from cart where cartID=?";
  const qry2 = "insert into payment(userID,cardNumber,expDate) values(?,?,?)";
  pool.query(qry1,[cartID], (err,result1) =>{
    if (err){
      return callback(err,null);
    }else{
      pool.query(qry2,[userID,cardNumber,expDate], (err,result2) =>{
        if (err){
          return callback(err,null);
        }else{
          //console.log(result2)
          return callback(null,true);
        }
      });

    }
  });
}
