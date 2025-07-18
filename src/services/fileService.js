const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const { getParentId } = require("./folderService");

const insertFile = async (name, size, uuid, parentChain, userId) => {
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
    await prisma.file.findUnique({
    where: {
        name,
        parentId,
    },
    include: {
        name,
        size,
        uuid,
        uploadTime,
        
    }
    });
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
    insertFile,
    getFile,
    updateFile,
    deleteFile,
}