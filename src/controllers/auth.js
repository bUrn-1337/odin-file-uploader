const passport = require("passport");
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
const alphaErr = "must only contain letters.";

const { insertUser } = require("../services/userService");

const validateUser = [
    body("username").trim()
        .isAlpha().withMessage(`username ${alphaErr}`),
    body("password").trim()
        .isAlpha().withMessage(`password ${alphaErr}`),
];

exports.getRegister = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    return res.render("register", { errors: [] });
};

exports.getLogin = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    return res.render("login");
};

exports.postRegister = [
    validateUser,
    async (req, res, next) => {
        if (!req.isAuthenticated()) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log(errors);
                return res.status(400).render("register", {
                    title: "Create user",
                    errors: errors.array(),
                });
            }
            const { username, password } = req.body;
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                await insertUser(username, hashedPassword);
                return res.redirect("/login");
            } catch (err) {
                next(err);
            }
        }
    }
];

exports.postLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.log(err);
            return next(err);
        }
        if (!user) {
        
            return res.redirect("/login");
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            return res.redirect("/");
        });
    })(req, res, next);
};