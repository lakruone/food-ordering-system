const express = require('express');
const app = express();
const bodyParser = require ('body-parser');
const cors = require('cors');

const admin = require('./routes/admin');
const user = require('./routes/user');


//cross origin resource sharing
app.use(cors())

//bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routes
app.use("/user",user);
app.use("/admin",admin);


//listening port
const port = process.env.PORT||5000;
app.listen(port, () => {
  console.log(`listening the port ${port}`);
});
