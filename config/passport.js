require("dotenv").config();
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
var createUser = require('../models/userSchema').User
const passport = require('passport')
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    createUser.findOne({_id: jwt_payload.id}).then(function(user) {
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    }).catch(err=>{
        done(err,false)
    });
}));