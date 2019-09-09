var express = require('express');
var router = express.Router();
const models = require('../models')
const crypto = require('crypto');
const jwt = require("jsonwebtoken");


// Sign Up
router.post("/signup",function(req,res,next){
  let user = req.body;
  let password = user.password;
  let salt = Math.round((new Date().valueOf()*Math.random()))+"";
  let encryptedPW=crypto.createHash('sha512').update(password+salt).digest("hex");
  models.user.create({
    email:user.email,
    password:encryptedPW,
    salt:salt
  }).then(result =>{
    console.log(result);
    console.log("회원가입을 완료했습니다");
    res.send("success")
  }).catch(err => {
    console.log(err);
    res.send("fail")
  })
});

// Sign In
router.post("/signin", async function(req,res,next){
  let user = req.body;
  const secret = req.app.get('jwt-secret');
  const token = jwt.sign({
            email: user.email
        }, 
        secret,{
            expiresIn: '1h',
            issuer: 'parkeunsoo',
        })

  let info = await models.user.findOne({
    where:{
      email : user.email
    }
  }).catch(err =>{
    console.log("회원이 없습니다.");
  });

  let DBpassword = info.dataValues.password;
  let salt = info.dataValues.salt;
  let inputPassword = user.password;
  let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");

  if(DBpassword == hashPassword){
    console.log('로그인에 성공하셨습니다.');
    res.json({
      token: token
    })
  }
  else{
    console.log('로그인에 실패하셨습니다.')
    res.send("fail")
  }
});
module.exports = router;
