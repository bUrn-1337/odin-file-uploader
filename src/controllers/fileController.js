const { getFile, uploadFile,  deleteFile, updateFile } = require("../services/fileService");
const { getFolder } = require("../services/folderService");
const { extractPublicId } = require('cloudinary-build-url');

const cloudinary = require("../config/cloudinaryConfig");

const deleteFromCloudinary = async (url) => {
  const publicId = extractPublicId(url); 

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary delete result:", result);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

const getFileHandler = async (req, res) => {
    const path = req.path;
    const userId = req.user.id;
    const parentChain = path.split("/");
    const filename = parentChain.splice(-1, 1)[0];
    const file = await getFile(filename, parentChain, userId);
    const url = file.url;
    res.render("file", {
        url,
        file
    })
}

const postFileHandler = async (req, res) => {
    const path = req.path;
    const userId = req.user.id;
    const parentChain = path.split("/");
    const file = req.file;
    const name = file.originalname;
    const uuid = file.filename.replace("uploads/", "");
    const size = file.size;
    const url = file.path;
    const isFolder = await getFolder(name, parentChain, userId);
    const isFile = await getFile(name, parentChain, userId);
    if (isFile || isFolder) {
        return res.status(400).json({ error: 'A file or folder with that name already exists here.' });
    }
    try {
        await uploadFile(url, name, size, uuid, parentChain, userId);
        
         res.sendStatus(202);
    } catch (err) {
        res.sendStatus(500);
        console.log(err);
    }
}

const updateFileHandler = async (req, res) => {
    const path = req.path;
    const userId = req.user.id;
    const { newName } = req.body;
    const parentChain = path.split("/");
    const filename = parentChain.pop();
    
    try {
        await updateFile(filename, newName, parentChain, userId);
        res.sendStatus(200);
    } catch(e) {
        res.sendStatus(500);
    }
}

const deleteFileHandler = async (req, res) => {
    const path = req.path;
    const userId = req.user.id;
    const parentChain = path.split("/");
    const filename = parentChain.pop();
    const file = await getFile(filename, parentChain, userId);
    const url = file.url;
    
    await deleteFromCloudinary(url);
    await deleteFile(filename, parentChain, userId);
    res.send(200);
}

module.exports = {
    getFileHandler,
    postFileHandler,
    updateFileHandler,
    deleteFileHandler,
}