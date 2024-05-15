const express=require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {body,validationResult} = require('express-validator');
require("dotenv").config();

const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');

const JWT_TOKEN = process.env.SECRETKEY || "SecretKey";
const router = express.Router();

//Route 1: Create a User using : Post "/api/auth/createuser" , doest require auth

router.post('/createuser',[
    body('email',"Enter a valid email").isEmail(),
    body('password',"Min Length is 5").isLength({ min: 5 }),
],async (req,res)=>{
    //if there are errors, return bad request and the errors 
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
      return res.status(400).json({success, error: "Fields Cant be Empty" });
    }
    try{
    //Check Wether the user with this email exist already
    let user = await User.findOne({email:req.body.email});
    if(user){ 
        return res.status(400).json({success,error:"Sorry a user with this email already exist"});
    }

    if(req.body.password !=req.body.cpassword){
        return res.status(400).json({success,error:"Password does't Match"});
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password,salt);
    user = await User.create({
        name: req.body.name,
        email:req.body.email,
        password: secPass,
      });
    const data = {
        user:{
            id: user._id
        }
    }
    
    const authtoken = jwt.sign(data,JWT_TOKEN);
    success=true;
    res.status(200).json({success,authtoken});  
    }
    catch(error){
        console.error(error.message);
        res.status(500).json({success:false,error:"Internal Server Error"});
    }
})


//Route 2 : Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login',[
    body('email',"Enter a valid email").isEmail(),
    body('password','Password cant be blank').exists(),
],async(req,res)=>{
    let success = false;

    //if there are errors then return Bad Request and Errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(400).json({success,error:"Fields can not be empty"});
    }

    const {email,password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user)
        {
            return res.status(400).json({success,error:"Invalid UserName or Password"});
        }
        const passComp = await bcrypt.compare(password,user.password);
        if(!passComp)
        {
            return res.status(400).json({success,error:"Invalid UserName or Password"});
        }
        const data = {
            user:{
                id: user._id
            }
        }
        success=true;
        const authtoken = jwt.sign(data,JWT_TOKEN);
        res.status(200).json({success,authtoken}); 

    }catch(error){
        console.error(error.message);
        res.status(500).json({success:false,error:"Internal Server Error"});
    }

});


//Route 3 : Get loggedin user details using : Post "/api/auth/getuser" . Login required
router.post('/getuser',fetchuser,async (req,res)=>{
    try{
        var userId=req.user.id;
        const user = await  User.findById(userId).select("-password");
        res.status(200).json({success:true,user:user});
    
    }catch(error){
        console.error(error.message);
        res.status(500).json({success:false,error:"Internal Server Error"});
    }

})

module.exports = router;