module.exports = (req, res, next) => {
    if (req.session == undefined || req.session.passport == undefined || req.session.passport.user == undefined) {
        res.redirect('/login');
    } else
        next();
}