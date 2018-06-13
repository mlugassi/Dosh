module.exports = (req, res, next) => {
    console.log("checksession");
    if (req.session === undefined || req.session.passport === undefined || req.session.passport.user === undefined)
        res.redirect('/login');
    else
        next();
}