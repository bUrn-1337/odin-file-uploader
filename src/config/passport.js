const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

passport.use(
    new LocalStrategy({ usernameField: 'username' }, async (username, password, done) => {
        try {
            const { rows } = await prisma.findUnique({ where: { username } });
            const user = rows[0];
            if (!user) return done(null, false, { message: 'User not found' });

            const match = await bcrypt.compare(password, user.password);
            if (!match) return done(null, false, { message: 'Incorrect password' });

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err);
    }
});