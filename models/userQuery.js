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
