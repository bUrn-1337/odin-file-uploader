const { Router } = require("express");
const router = Router();
const folderController = require("../controllers/folderController");
const { ensureAuthenticated } = require("../middlewares/auth");

router.get("/*", ensureAuthenticated, folderController.getFolderHandler);
router.post("/*", ensureAuthenticated, folderController.createFolderHandler);
router.put("/*", ensureAuthenticated, folderController.updateFolderHandler);
router.delete("/*", ensureAuthenticated, folderController.deleteFolderHandler);

module.exports = router;