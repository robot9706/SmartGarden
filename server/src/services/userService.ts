import passport from "passport";
import { userModel } from "../model/model";

const login = (req, res) => {
    if (req.body.username && req.body.password) {
        passport.authenticate("local", (error, user) => {
            if (error) {
                return res.status(403).send({
                    ok: false,
                    error: error
                });
            } else {
                req.logIn(user, (error) => {
                    if (error) return res.status(500).send({
                        ok: false,
                        error: error
                    });
                    return res.status(200).send({
                        ok: true,
                        error: null
                    });
                });
            }
        })(req, res);
    } else {
        res.status(400).send({
            ok: false,
            error: "Missing username or password!"
        });
    }
}

const logout = (req, res) => {
    if (req.isAuthenticated()) {
        req.logout();
        res.status(200).send({ ok: true });
    } else {
        res.status(403).send({ ok: false, error: "No user!" });
    }
}

const register = (req, res) => {
    if (req.body.username && req.body.password) {
        const user = new userModel({
            username: req.body.username,
            password: req.body.password
        });
        console.log(userModel);
        console.log(user);
        user.save((error) => {
            if (error) {
                if (error.code === 11000) {
                    return res.status(500).send({
                        ok: false,
                        error: "Already exists!"
                    });
                }

                return res.status(500).send({
                    ok: false,
                    error: error.toString()
                });
            }

            return res.status(200).send({
                ok: true,
                error: null
            });
        })
    } else {
        return res.status(400).send({
            ok: false,
            error: "Missing username or password!"
        });
    }
}

export const initUserService = (router) => {
    router.route("/login").post(login);
    router.route("/logout").get(logout);
    router.route("/register").post(register);
}