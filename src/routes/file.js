const { Router } = require("express");
const { ensureAuthenticated } = require("../middlewares/auth");
const router = Router();

router.post("/:folderPath", ensureAuthenticated, );


module.exports = router;