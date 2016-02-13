exports.getDbUri = function () {
    return process.env.MONGOLAB_URI || 'mongodb://localhost:27017/example';
};

exports.getPort = function () {
    return process.env.PORT || 5000;
}

