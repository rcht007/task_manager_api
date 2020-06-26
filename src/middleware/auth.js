 const jwt=require('jsonwebtoken')
 const User=require('../models/user')

 const auth= async (req,res,next)=>{
     try{
         //header type authorisation and repkace bearer with a blank strnig in the value
        const token=req.header('Authorization').replace('Bearer ','')
        const decoded=jwt.verify(token,'db_auth')
        const user= await User.findOne({_id:decoded._id,'tokens.token':token})
       if(!user){
           throw new Error()
       }
       //giving route handler accss to the user selected
       req.token=token
       req.user=user
        next()
     }catch(e){
        res.status(401).send({error:'please autenticate...'})
     }
 }
 module.exports=auth