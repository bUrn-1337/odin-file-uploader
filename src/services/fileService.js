const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const { getParentId } = require("./folderService");

const uploadFile = async (name, size, uuid, parentChain, userId) => {
    const parentId = await getParentId(parentChain, userId);
    await prisma.file.create({
        data: {
            name,
            size,
            uuid,
            parentId
        }
    });
}

const getFile = async (name, parentChain, userId) => {
    const parentId = await getParentId(parentChain, userId);
    if (parentId === null) {
        console.log(`getFile: Parent folder for file '${name}' in the requested path not found or user has no root.`);
        return null; // Return null early, as the file cannot be found in a non-existent path
    }
    const file = await prisma.file.findFirst({
        where: {
            name,
            parentId,
        },
        select: {
            name: true,
            size: true,
            uuid: true,
            uploadTime: true,

        }
    });
    return file;
}

const updateFile = async (name, newName, parentChain, userId) => {
    const parentId = await getParentId(parentChain, userId);
    await prisma.file.update({
        where: {
            name,
            parentId
        },
        data: {
            newName,
        }
    })
}

const deleteFile = async (name, parentChain, userId) => {
    const parentId = await getParentId(parentChain, userId);
    await prisma.file.delete({
        where: {
            name,
            parentId,
        }
    })
}

module.exports = {
    uploadFile,
    getFile,
    updateFile,
    deleteFile,
}