const express = require("express");
const passport = require('passport');
const path = require("node:path");
const expressSession = require('express-session');
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
require("./config/passport");
const prisma = new PrismaClient();


const fileRouter = require("./routes/file");
const folderRouter = require("./routes/folder");
const authRouter = require("./routes/auth");
const uploadRouter = require("./routes/upload");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    expressSession({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000 // ms
        },
        secret: 'a santa at nasa',
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(
            new PrismaClient(),
            {
                checkPeriod: 2 * 60 * 1000,  //ms
                dbRecordIdIsSessionId: true,
                dbRecordIdFunction: undefined,
            }
        )
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use((req, res, next) => {
    if (req.path === '/favicon.ico') {
        return res.status(204).end(); 
    }
    if (req.path.startsWith('/com.chrome.devtools.json') || req.path.includes("chrome.devtools") || req.path.startsWith('/json')) {
        console.log(`Ignoring internal browser/devtool request: ${req.path}`);
        return res.status(204).end(); 
    }
    next();
});

app.use("/upload", uploadRouter);
app.use(authRouter);
app.use(folderRouter);
app.use(fileRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}`));
