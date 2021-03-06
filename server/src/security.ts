import url from "url";

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
    const baseUrl = url.parse(req.url).pathname;
    if (!req.isAuthenticated() && securityUrls.includes(baseUrl)) {
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
    if (req == null || req.session == null || req.session.passport == null || req.session.passport.user == null) {
        return null;
    }

    return req.session.passport.user._id;
}