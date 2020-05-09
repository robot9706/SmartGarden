import passport from "passport";
import passportLocal from "passport-local";
import expressSession from "express-session";
import { userModel } from "./model/model";

const EXPRESS_SECRET = "secretest-secret";

export const initPassport = (app) => {
    app.use(expressSession({
        secret: EXPRESS_SECRET
    }));

    app.use(passport.initialize());
    app.use(passport.session());
}

passport.serializeUser((user, done) => {
    if (!user) {
        return done("No user provided!", null);
    }

    return done(null, user);
});

passport.deserializeUser((user, done) => {
    if (!user) {
        return done("No user provided!", null);
    }

    return done(null, user);
});

passport.use("local", new passportLocal.Strategy((username, password, done) => {
    userModel.findOne({
        username: username
    }, (err, user) => {
        if (err) {
            return done(err);
        }

        if(user) {
            user.comparePassword(user, password, (error, isMatch) => {
                if(error || !isMatch) return done("Wrong password!");
                return done(null, user);
            })
        } else {
            return done("User not found!");
        }
    });
}));
