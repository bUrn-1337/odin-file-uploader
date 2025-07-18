const { Router } = require("express");
const { ensureAuthenticated } = require("../middlewares/auth");
const uploadMiddleware = require("./uploadMiddleware");
const upload = uploadMiddleware("uploads");
const router = Router();

const fileController = require("../controllers/fileController");

router.get("/*",  ensureAuthenticated, fileController.getFileHandler);
router.post("/*", ensureAuthenticated,  upload.single("file"),fileController.postFileHandler);
router.put("/*", ensureAuthenticated, fileController.updateFileHandler);
router.delete("/*", ensureAuthenticated, fileController.deleteFileHandler);

module.exports = router;