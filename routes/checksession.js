module.exports = (req, res, next) => {
    console.log("checksession");
    console.log("session: " + req.session);
    console.log("passport: " + req.session.passport);


    if (req.session == undefined || req.session.passport == undefined || req.session.passport.user == undefined)
    {
        console.log("I'm passed the IF");
        res.redirect('/login');
    }
    else
    {
        next();
    }
}