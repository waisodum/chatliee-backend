var express = require("express");
var router = express.Router();
var User = require("../models/userSchema").User;
var Post = require("../models/userSchema").Post;

const passport = require("passport");
router.use(passport.initialize());
require("../config/passport");

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // console.log(req.user._id);
    // console.log(req.body.fileData);
    var data = {
      ...req.body.fileData,
      userId: `${req.user._id}`,
    };
    // console.log(data);
    const post = new Post(data);
    try{const postData=await post.save()
    // console.log(postData);


    const user=await User.findOne({username:req.user.username}) ;
     user.posts.push(postData._id)
await user.save()
    return res.status(200).send("thanks");}
    catch(err){
return res.status(404).send('ds')
    }

  }
);

router.post('/fetch',async(req,res)=>{
  var page = req.query.page||0
  var limit=10;
try {
   var posts=  await Post.find(req.body)
    .skip(page*limit).limit(limit)
    return res.send(posts)
} catch (error) {
  res.status(500).send('internal server error')
}
//  console.log(req.body);
//  console.log(posts)
  })

module.exports = router;
