const { getRootId } = require("./userService");

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const getChildId = async (name, parentId) => {
    const folder = await prisma.folder.findUnique({
        where: {
            parentId,
            name,
        }
    })
    return folder.id;
}

const getParentId = async (parentChain, userId) => {
    let parentId = await getRootId(userId);
    for (let i = 0; i < parentChain.length; i++) {
        parentId = await getChildId(parentChain[i], parentId);
    }
    return parentId;
}

const insertFolder = async (name, parentChain, userId) => {
    const parentId = await getParentId(parentChain, userId);
    await prisma.folder.create({
        data: {
            name,
            userId,
            parentId,
        }
    })
}

const getFolder = async (name, parentChain, userId) => {
    const parentId = await getParentId(parentChain, userId);
    const folder = await prisma.folder.findUnique({
        where: {
            name,
            parentId,
        },
        include: {
            name: true,
            files: {
                select: {
                    name: true,
                }
            },
            children: {
                select: {
                    name: true,
                }
            },
        },
    });
    return folder;
}

const getRootFolder = async (userId) => {
    const folder = await prisma.folder.findFirst({
        where: {
            userId,
        },
        include: {
            name: true,
            files: {
                select: {
                    name: true,
                }
            },
            children: {
                select: {
                    name: true,
                }
            },
        },
    });
    return folder;
}

const updateFolder = async (name, parentChain, userId, newName) => {
    const parentId = await getParentId(parentChain, userId);
    await prisma.folder.update({
        where: {
            name,
            parentId,
        },
        data: {
            name: newName,
        }
    }); 
}

const deleteFolder = async (name, parentChain, userId) => {
    const parentId = await getParentId(parentChain, userId);
    await prisma.folder.delete({
        where: {
            name,
            parentId
        }
    });

}


module.exports = {
    insertFolder,
    getFolder,
    updateFolder,
    deleteFolder,
    getRootFolder,
    
}