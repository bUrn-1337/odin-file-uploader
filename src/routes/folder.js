const { Router } = require("express");
const router = Router();
const folderController = require("../controllers/folderController");
const { ensureAuthenticated } = require("../middlewares/auth");

router.get("/:path", ensureAuthenticated, folderController.getFolderHandler);
router.post("/:path", ensureAuthenticated, folderController.createFolderHandler);
router.put("/:path", ensureAuthenticated, folderController.updateFolderHandler);
router.delete("/:path", ensureAuthenticated, folderController.deleteFolderHandler);

module.exports = router;