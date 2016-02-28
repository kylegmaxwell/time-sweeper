exports.getPort = function () {
    return process.env.PORT || 5001;
}

exports.getDbUri = function () {
    return process.env.MONGOLAB_URI || 'mongodb://localhost:27017/example';
};

exports.getFacebookId = function () {
    return process.env.FACEBOOK_CLIENT_ID || '123';
};

exports.getFacebookSecret = function () {
    return process.env.FACEBOOK_CLIENT_SECRET || 'abc';
};

exports.getCallbackUrl = function () {
    return process.env.CALLBACK_URL || 'http://localhost:'+this.getPort()+'/auth/facebook/callback';
};

exports.getAppSecret = function () {
    return process.env.SECRET || 'cats';
}
