


module.exports.verifyToken = (req,res,next) => {
  //get auth header values

  const bearerHeader = req.headers['authorization'];

  //check if bearer is undefined
  if(typeof bearerHeader !== 'undefined'){
    //split at the space
    const bearer = bearerHeader.split(' ');

    //get token from array
    const bearerToken = bearer[1];

    //set the Token
    req.token = bearerToken;

    //call next middleware
    next();
  }else{
    //forbidden

    res.status(403).json({data:"unauthorized access. Forbidden"});
  }
}
