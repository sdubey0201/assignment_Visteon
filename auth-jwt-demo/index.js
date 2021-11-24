const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
var jwt = require('jsonwebtoken'); 
const mongoDBUri = 'mongodb://my-mongodb:27017/usersAuthdb';
var mongoose = require('mongoose');
mongoose.connect(mongoDBUri); // connect to database
var userModel = require("./models/user")
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// add router in express app
app.use("/",router);

const JWT_KEY_SECRET = "secret" // random key 


router.get('/',function(req,res){
    console.log("tess called")
    res.json({message:"test called"});
    });

router.post("/login",(req, res) => {
    console.log("login called :")
    console.log("login called req body:",req.body)
    var userName = req.body.userName;
    var password = req.body.password;
    userModel.findOne({
        userName:userName,
        password:password
    },function(error,user){
        console.log("login called error ",error);
        console.log("login called user ",user);
        if(error){            
            console.log("data base error :",error);
            return res.status(400).json({ success: false, message:"Data base error" });
        }else{
            
            if(user==null){
                console.log("User not Found");
                return res.status(400).json({ success: false, message:"user name or password is not matched." });
            }else{
              if(user.userName ===req.body.userName && user.password === req.body.password){
                console.log("User matched..");
                var payload = {
                    userName: req.body.userName
                };
                var token = jwt.sign(payload, JWT_KEY_SECRET, {
                    expiresIn: "300000"  // expires in 2 minute
                });
                res.json({
                    token:token
                    });

              }else{
                return res.status(400).json({ success: false, message:"user name or password is not matched." });
              }
            }
        }

    });


    // res.json({
    //     message:"Success!!"
    // });
    });

    var validateToken = function(req, res) {
        var token = req.headers['authorization'];
        console.log("validateToken called token",token);
        if (token && token.startsWith("Bearer ")){
            token = token.substring(7, token.length);
       } else {
        console.log("vplease provide berear token");
        return res.status(403).send({
            success: false,
            message: 'please provide braret token'
        });
       }
      
        if (!token) {
            console.log("No token provided.");
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
        jwt.verify(token, JWT_KEY_SECRET, function(err, decoded) {
            if (err) {
                console.log("token expired!..");
                    console.log(err);
                        return res.status(400).json({ success: false, message: err.message });
                    }else{
                        console.log(decoded);
                        return res.status(200).send({
                            success: true,
                            message: 'token is validated.'
                        });
                    }
                });
            
    };
    router.post("/validate", function(req, res) {
    console.log("validate is called");
    validateToken(req, res);
});


app.listen(3000,() => {
console.log("Started on PORT 3000");
})