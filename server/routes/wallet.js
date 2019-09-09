var express = require('express');
var router = express.Router();
const verify = require('../auth/auth');

// Check JWT verification
router.use('/', verify)

router.post("/check",function(req,res,next){
  res.send("success")
});

// Sign In
module.exports = router;
