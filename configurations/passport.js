const mongo_util = require('../utils/mongo.util');
const mongo_config = require('./mongo.config');
const { Strategy, ExtractJwt } = require('passport-jwt');
const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = mongo_config.database.secretOrKey;

module.exports = passport => {
    let mongo_client = mongo_util.dbClient();
    passport.use(new Strategy(options, async (jwt_payload, done) => {
        await mongo_client.collection.find({ '_id': jwt_payload.id }).then(user => {
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        }).catch(err => console.error(err));
    }));
};
