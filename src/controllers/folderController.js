const { insertFolder, getFolder, updateFolder, deleteFolder, getRootFolder } = require("../services/folderService");
const { getFile } = require("../services/fileService");
const createFolderHandler = async (req, res, next) => {
    const action = req.query.action;
    if (action === "file") {
        return next();
    }
    const path = req.path;
    const { name } = req.body;
    const userId = req.user.id;
    const parentChain = path.split("/");
    const folder = await getFolder(name, parentChain, userId);
    const file = await getFile(name, parentChain, userId);
    if(file || folder) {
        return res.status(400).json({ error: 'A file or folder with that name already exists here.' });
    }
    await insertFolder(name, parentChain, userId);
    res.redirect(req.path);
}

const getFolderHandler = async (req, res, next) => {
    const action = req.query.action;
    if (action === "file") return next();
    
    let path  = req.path;
    
    const userId = req.user.id;
    //handle root folder differently
    if (path == "/") {
        const folder = await getRootFolder(userId);
        if (!folder) return res.sendStatus(404);
        console.log(folder);
        return res.render("index", {
            currentPath: "",
            folder,
        })
    } 
    path = path.split("/");
    const name = path.splice(-1, 1)[0];
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
    
    const userId = req.user.id;
    const { newName } = req.body;
    const path = req.path;
    const parentChain = path.split("/");
    parentChain.shift();
    const name = parentChain.splice(-1, 1)[0];
    try {
        const folder = await getFolder(name, parentChain, userId);
        if (!folder) {
            return next();
        }
        await updateFolder(name, parentChain, userId, newName);
        res.redirect("/"+ parentChain.join("/"))
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
    const userId = req.user.id;

    const path = req.path;
    const parentChain = path.split("/");
    const name = parentChain.splice(-1, 1)[0];
    try {
        const folder = await getFolder(name, parentChain, userId);
        await deleteFolder(name, parentChain, userId);
        res.json({ok:"ok"});
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
}

module.exports = {
    createFolderHandler,
    getFolderHandler,
    updateFolderHandler,
    deleteFolderHandler,

}