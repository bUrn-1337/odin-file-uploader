const { Router } = require("express");
const router = Router();
const folderController = require("../controllers/folderController");
const { ensureAuthenticated } = require("../middlewares/auth");

router.post("/:parentPath", ensureAuthenticated, folderController.createFolder);

module.exports = router;