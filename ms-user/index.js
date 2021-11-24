const express = require("express");
const request = require('request')
const bodyParser = require("body-parser");
const router = express.Router();
const app = express();
const mongoDBUri = 'mongodb://my-mongodb:27017/usersdetaildb';
const tokenEndPoint = "http://auth-ms-node-app:3000/validate"
var mongoose = require('mongoose');
const user = require("./models/user");
mongoose.connect(mongoDBUri); // connect to database
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// add router in express app
app.use("/v1", router);

var validateToken = function(req, res, callback) {
    //console.log("validateToken called callback",callback);
    //console.log("validateToken called headers",req.headers);
    //console.log("validateToken called authorization",req.headers.authorization);
    request.post({
        headers: {'content-type' : 'application/json',"authorization":req.headers.authorization},
        url:     tokenEndPoint,
        body:    ""
      }, function(error, response, body){
          if(error){
            console.log("token verification call error ",error);
            return res.status(400).json({success: false, message: "could not verify token" });
          }else{
            console.log("token verification call body ",body);
            console.log("token verification call statusCode ",response.statusCode);
            if(response.statusCode ==200){
            console.log("token verification success :");
               return callback();
            }else{
                return res.status(400).json({success: false, message: "could not verify token" });  
            }
            
          }
      });
    
   
};

// route middleware verify a token
router.use(function(req, res, next) {
    validateToken(req, res, next);
});

router.get('/users', function (req, res) {
    console.log("GET: users called")
    user.find(function (err, user) {
        if (user) {
            console.log(user);
            return res.status(200).json({success: true,user:user});
        } else {
            if(err){
                console.log(err);
                return res.status(400).json({ success: false, message: "Data base error !" });
            }else{
                return res.status(400).json({ success: false, message: "user data not found!" });
            }
            
        }
    });
});
router.post('/users', function (req, res) {
    console.log("POST: users called")
    console.log("POST: users called body", req.body)
    const { firstName, lastName, age } = req.body;
    user.findOneAndUpdate({ firstName, lastName, age }, { firstName, lastName, age }, { upsert: true }, function (err, data) {
        if (err) {
            console.log("POST: users called body with error ", err)
            return res.status(400).json({success: false, message: "data base error" });
        } else {
            console.log('saved res1', data);
            return res.status(200).json({success: true, user: {userId:firstName}});
        }

    })
});

router.get('/users/:userId', function (req, res) {
    console.log("GET: users userId called param ", req.params)
    var userId = req.params.userId;
    user.findOne({ firstName: userId }, function (err, user) {
        console.log("GET: users userId called param err", err)
        console.log("GET: users userId called param user", user)
        if(err){
            return res.status(400).json({ success: false, message: "Data base error" });
        }else{
            if (user) {
                return res.status(200).json({success: true,user:user});
            } else {
                return res.status(200).json({ success: false, message: "User data not found!" });
            }
        }
        
    });
});

router.post('/users/:userId', function (req, res) {
    console.log("POST: users userid called")
    console.log("POST: users called body", req.body)
    console.log("POST: users called userid ", req.params.userId)
    const userId = req.params.userId;
    const {firstName, lastName, age} = req.body;
    console.log("POST: users called userId1 ", userId)
    user.findOneAndUpdate({firstName:userId}, {lastName, age }, { upsert: true }, function (err, data) {
        if (err) {
            console.log('POST: users called userId1', err);
            return res.status(400).json({  success: false,message: "User data not found!" });
        } else {
            console.log('sPOST: users called userId1', data);
            return res.status(200).json({  success: true,message: "user details updated" });
        }

    });
});

    app.listen(3001, () => {
        console.log("Started on PORT 3001");
    })