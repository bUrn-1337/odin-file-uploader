const { PrismaClient } = require("@prisma/client");


const prisma = new PrismaClient();

const insertUser = async (username, password) => {
    return prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
            data: {
                username,
                password,
            }
        });
        const rootFolder = await tx.folder.create({
            data: {
                name: "root",
                userId: newUser.id,
                parentId: null,
            }
        });

        await tx.user.update({
            where: { id: newUser.id },
            data: {
                rootFolderId: rootFolder.id,
            }
        });

        return newUser; 
    });
};

const getRootId = async (userId) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        }
    });
    return user.rootFolderId;
}
module.exports = {
    insertUser,
    getRootId,
}