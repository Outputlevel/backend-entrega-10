const auth = function (req, res, next) {
    const {username, password} = req.query;
    if (username !== 'rix' || password !== 'Coder2023') {
        return res.send('login failed');
    }

    req.session.user = username;
    req.session.admin = true;
    return next();
}

function logged(req, res, next) {
    if (req.session.user) {
        return res.redirect("/views");
    }

    next();
}

export  {auth, logged};