const { getFileUUID, uploadFile, uploadFile, deleteFile, updateFile } = require("../services/fileService");
const { getFolder } = require("../services/folderService");

const cloudinary = require("../config/cloudinaryConfig");

const deleteFromCloudinary = async (uuid) => {
  const publicId = `uploads/${uuid}`; // Folder name is 'uploads' for all files

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
    const parentChain = path.split("/").filter(Boolean);
    const filename = parentChain.pop();
    const file = await getFile(filename, parentChain, userId);
    const uuid = file.uuid;
    const url = cloudinary.url(`uploads${uuid}`, {
        secure: true,
        resource_type: "auto",
    });
    res.render("file", {
        url,
        file
    })
}

const postFileHandler = async (req, res) => {
    const parentPath = req.path;
    const userId = req.user.id;
    const parentChain = parentPath.split("/");
    const isFolder = getFolder(name, parentChain, userId);
    const isFile = getFile(name, parentChain, userId);
    if (isFile || isFolder) {
        return res.status(400).json({ error: 'A file or folder with that name already exists here.' });
    }
    const file = req.file;
    const name = file.originalname;
    const uuid = file.filename;
    const size = file.size;
    try {
        await uploadFile({ name, size, uuid, }, parentChain, userId);
        res.sendStatus(200);
    } catch (err) {
        res.sendStatus(500);
    }
}

const updateFileHandler = async (req, res) => {
    const path = req.path;
    const userId = req.user.id;
    const { newName } = req.body;
    const parentChain = path.split("/").filter(Boolean);
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
    const parentChain = path.split("/").filter(Boolean);
    const filename = parentChain.pop();

    const file = await getFile(filename, parentChain, userId);
    const uuid = file.uuid;
    
    await deleteFromCloudinary(uuid);
    res.send(200);
}

module.exports = {
    getFileHandler,
    postFileHandler,
    updateFileHandler,
    deleteFileHandler,
}