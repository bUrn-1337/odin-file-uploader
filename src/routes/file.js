const { Router } = require("express");
const { ensureAuthenticated } = require("../middlewares/auth");
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const upload = uploadMiddleware("uploads");
const router = Router();

const fileController = require("../controllers/fileController");

router.get("{*path}",  ensureAuthenticated, fileController.getFileHandler);
router.post("{*path}", ensureAuthenticated,  upload.single("file"),fileController.postFileHandler);
router.put("{*path}", ensureAuthenticated, fileController.updateFileHandler);
router.delete("{*path}", ensureAuthenticated, fileController.deleteFileHandler);

module.exports = router;