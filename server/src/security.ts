let securityUrls = [];

export const addSecurity = (data: String | String[]) => {
    if (data instanceof Array) {
        data.forEach(url => {
            securityUrls.push(`/data${url}`);
        });
    } else {
        securityUrls.push(`/data${data}`);
    }
}

export const securityMiddleware = (req, res, next) => {
    if (!req.isAuthenticated() && securityUrls.includes(req.url)) {
        res.status(403).send({
            ok: false,
            error: "Not logged in!"
        });
    }
    else {
        next();
    }
}

export const getSessionUserID = (req) => {
    return req.session.passport.user._id;
}