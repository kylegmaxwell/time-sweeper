/**
 * The port used by the local server
 * @return {Number} The port number
 */
exports.getPort = function () {
    return process.env.PORT || 5000;
}

/**
 * This is the uri of the Mongo Lab database.
 * Defaults to locally running database when not set.
 * @return {String} The uri
 */
exports.getDbUri = function () {
    return process.env.MONGOLAB_URI || 'mongodb://localhost:27017/example';
};

/**
 * Facebook app id for authentication.
 * @return {Sttring} The app id
 */
exports.getFacebookId = function () {
    return process.env.FACEBOOK_CLIENT_ID || '123';
};

/**
 * The facebook secret used to validate the app
 * @return {String} The secret
 */
exports.getFacebookSecret = function () {
    return process.env.FACEBOOK_CLIENT_SECRET || 'abc';
};

/**
 * This is the url that facebook redirects to after login.
 * @return {String} The url
 */
exports.getCallbackUrl = function () {
    if (process.env.ENV === 'prod') {
        return 'http://time-sweeper.herokuapp.com/auth/facebook/callback';
    } else {
        return 'http://localhost:'+this.getPort()+'/auth/facebook/callback';
    }
};

/**
 * This is the secret used to encrypt user data and the express session.
 * @return {String} The secret
 */
exports.getAppSecret = function () {
    return process.env.SECRET || 'cats';
}
