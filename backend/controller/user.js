const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


exports.createUser = (req,res,next)=>{
  bcrypt.hash(req.body.password,10).then(result=>{
    const user = new User({
     fname : req.body.fname,
     phone : req.body.phone,
     occupation : req.body.occupation,
     email : req.body.email,
     password: result
    });
    user.save().then(response=>{
      console.log(response);
      res.status(201).json({messege:"fetched succefully",result :response});
    }).catch(err=>{
     res.status(500).json({messege:"Invalid Authentification Crendential "});
    });
  }
  )
}

exports.loginUser = (req,res,next)=>{
  let fetchedUser;
   User.findOne({email:req.body.email}).then(match=>{
     if(!match){
       return res.status(401).json({messege:"Authentification failed!!"});
     }
     fetchedUser = match;
     return bcrypt.compare(req.body.password,match.password);
      })
     .then(result=>{
       if(!result){
         return res.status(401).json({messege:"Authentification failed!!"});
       }
       const token = jwt.sign({email:fetchedUser.email,userId: fetchedUser._id},
         process.env.JWT_KEY,
         {expiresIn:"1hr"}
         ) ;

        res.status(200).json({token:token,userId:fetchedUser._id,messege:"Login Succesfully",expiresIn:3600});
     })
     .catch(err=>{
       return res.status(401).json({messege:"Invalid Authentification Crendential "});
     });



}
