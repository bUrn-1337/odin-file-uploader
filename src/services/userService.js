const { PrismaClient } = require("@prisma/client");


const prisma = new PrismaClient();

const insertUser = async (username, password) => {
    // Start a Prisma transaction to ensure both operations succeed or fail together.
    // This is good practice when creating related records.
    return prisma.$transaction(async (tx) => {
        // 1. Create the User first.
        const newUser = await tx.user.create({
            data: {
                username,
                password,
                // rootFolderId is nullable, so we don't set it yet
            }
        });

        // 2. Create the Root Folder, linking it to the newUser's ID
        //    and explicitly setting parentId to null.
        const rootFolder = await tx.folder.create({
            data: {
                name: "root",
                userId: newUser.id, // Link to the user who owns this folder
                parentId: null,     // Mark this as a root folder (no parent)
                // The 'userRoot' relation field on Folder is automatically managed
                // by Prisma when you link the Folder back to the User's rootFolderId.
            }
        });

        // 3. Update the User to link them to their newly created root folder.
        await tx.user.update({
            where: { id: newUser.id },
            data: {
                rootFolderId: rootFolder.id, // Link the user's rootFolderId to this folder
            }
        });

        return newUser; // Or anything else you need to return
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