const uploadMiddleware = require("./uploadMiddleware");

const { insertFolder, getFolder, updateFolder, deleteFolder, getRootFolder } = require("../services/folderService.js");

const createFolder = async (req, res, next) => {
    const action = req.query.action;
    if (action === "file") {
        return next();
    }
    const parentPath = req.path;
    const { name } = req.body;
    const userId = req.user.id;
    const parentChain = parentPath.split("/");
    const folder = getFolder(name, parentChain, userId);
    const file = getFile(name, parentChain, userId);
    if(file || folder) {
        return res.status(400).json({ error: 'A file or folder with that name already exists here.' });
    }
    await insertFolder(name, parentChain, userId);
}

const getFolderHandler = async (req, res, next) => {
    const action = req.query.action;
    if (action === "file") {
        return next();
    }
    let { path } = req.path;
    const userId = req.user.id;
    //handle root folder differently
    if (!path) {
        const folder = await getRootFolder(userId);
        return res.render("index", {
            currentPath: "/",
            folder,
        })
    } 
    path = path.split("/");
    const name = path.splice(-1, 1);
    const folder = await getFolder(name, path, userId);
    if (!folder) {
        return next();
    }
    res.render("index", {
        currentPath: req.path,
        folder,
    });
}
//root folder can not be updated
const updateFolderHandler = async (req, res, next) => {
    const action = req.query.action;
    if (action === "file") {
        return next();
    }
    let { path } = req.path;
    const userId = req.user.id;
    const { newName } = req.body;
    path = path.split("/");
    const name = path.splice(-1, 1);
    try {
        const folder = await getFolder(name, path, userId);
        if (!folder) {
            return next();
        }
        await updateFolder(name, path, userId, newName);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}
//root folder can not be deleted
const deleteFolderHandler = async (req, res, next) => {
    const action = req.query.action;
    if (action === "file") {
        return next();
    }
    let { path } = req.path;
    const userId = req.user.id;
    path = path.split("/");
    const name = path.splice(-1, 1);
    try {
        const folder = await getFolder(name, path, userId);
        if (!folder) {
            return next();
        }
        await deleteFolder(name, path, userId);
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = {
    createFolder,
    getFolderHandler,
    updateFolderHandler,
    deleteFolderHandler,

}