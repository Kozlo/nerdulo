function isNotProd(req, res, next) {
    if (process.env.NODE_ENV !== 'PRODUCTION') {
        console.log('Environment is not test, rendering unit test page....');
        next();
    } else {
        console.log('Not running any tests on production');
        res.redirect('/');
    }
}

module.exports = {
    isNotProd : isNotProd
};