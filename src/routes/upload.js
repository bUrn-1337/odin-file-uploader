const { Router } = require("express");
const { ensureAuthenticated } = require("../middlewares/auth");
const router = Router();

router.get("/file/{*path}", ensureAuthenticated, (req, res) => {
    currentPath = req.params.path;
    res.render("upload-file", {
        currentPath,
    });
});

router.get("/folder/{*path}", ensureAuthenticated,(req, res) => {
    req.params.path;
    res.render("make-folder", {
        currentPath,
    });
});

module.exports = router;