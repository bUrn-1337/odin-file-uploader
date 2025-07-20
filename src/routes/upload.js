const { Router } = require("express");
const { ensureAuthenticated } = require("../middlewares/auth");
const router = Router();

router.get("/file/*", ensureAuthenticated, (req, res) => {
    currentPath = req.path.slice("/file".length);
    res.render("upload-file", {
        currentPath,
    });
});

router.get("/folder/*", ensureAuthenticated,(req, res) => {
    req.path.slice("/file".length);
    res.render("make-folder", {
        currentPath,
    });
})