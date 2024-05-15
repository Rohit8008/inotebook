require("dotenv").config();
const jwt = require('jsonwebtoken');
const JWT_TOKEN = process.env.SECRETKEY;

const fetchuser = (req,res,next)=>{

    //Get user from the jwt token and add id to req object
    const token = req.header('auth-token');
    if(!token)
    {
        res.status(401).send({error:"Invaid Token"});
    }
    try{
        const data = jwt.verify(token,JWT_TOKEN);
        req.user = data.user;
        next();
    }
    catch(error){
        res.status(401).send({error:"Please use a valid Token"});
    }
}

module.exports= fetchuser;