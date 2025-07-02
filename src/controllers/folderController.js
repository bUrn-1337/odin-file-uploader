const { insertFolder, getFolder, updateFolder, deleteFolder } = require("../services/folderService");
const createFolder = async (req, res) => {
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

const getFolderHandler = async (req, res) => {
    let { path } = req.params;
    if (!path) {
        return res.render()
    }
    const userId = req.user.id; 
    path = path.split("/");
    const name = path.splice(-1, 1);
    const folder = await getFolder(name, path, userId);
    res.render("index", {
        folder,
    });
}

const updateFolderHandler = async (req, res) => {

}

const deleteFolderHandler = async (req, res) => {

}

module.exports = {
    createFolder,
    getFolderHandler,
    updateFolderHandler,
    deleteFolderHandler,

}