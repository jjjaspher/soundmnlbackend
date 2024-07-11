const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('./models/userModel');

const jwtOptions = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey :  'jaspher-secret-key'
};

const strategy = new JwtStrategy(jwtOptions, (payload, done) => {
    User.findOne({id: payload.id})
    .then(user => {
        if (user) {
            done(null, user);
          } else {
            done(null, false);
          }
    }).catch(err => {
        done(err, null);
    })
});


module.exports = (passport) => {
    passport.use(strategy)
}