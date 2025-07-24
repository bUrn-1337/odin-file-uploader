const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const { getParentId } = require("./folderService");

const uploadFile = async (url, name, size, uuid, parentChain, userId) => {
    const parentId = await getParentId(parentChain, userId);
    await prisma.file.create({
        data: {
            name,
            size,
            uuid,
            parentId,
            url,
        }
    });
}

const getFile = async (name, parentChain, userId) => {
    const parentId = await getParentId(parentChain, userId);
    if (parentId === null) {
        console.log(`getFile: Parent folder for file '${name}' in the requested path not found or user has no root.`);
        return null; 
    }
    const file = await prisma.file.findFirst({
        where: {
            name,
            parentId,
        },
        select: {
            id: true,
            name: true,
            size: true,
            uuid: true,
            uploadTime: true,
            url: true,
        }
    });
    return file;
}

const updateFile = async (name, newName, parentChain, userId) => {
    const parentId  = await getParentId(parentChain, userId);
    const file = await getFile(name, parentChain, userId);
    await prisma.file.update({
        where: {
            parentId: parentId,
            name: name,
            id: file.id,
        },
        data: {
            name: newName,
        }
    })
}

const deleteFile = async (name, parentChain, userId) => {
    const parentId = await getParentId(parentChain, userId);
    await prisma.file.delete({
        where: {
            parentId_name: {
                parentId: parentId,
                name: name,
            },
        }
    })
}

module.exports = {
    uploadFile,
    getFile,
    updateFile,
    deleteFile,
}