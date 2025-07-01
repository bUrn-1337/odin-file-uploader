const { insertFolder } = require("../services/folderService");
exports.createFolder = async (req, res) => {
    const { parentPath } = req.params;
    const { name } = req.body;

    let parent;
    if (parentPath.split("/").length > 0) {
        parent = parentPath.split("/")[-1];
    } else {
        parent = "home";
    }
    await insertFolder(name, parent);
}