const { PrismaClient } = require("@prisma/client");


const prisma = new PrismaClient();

const insertUser = async (username, password) => {
    await prisma.user.create({
        data: {
            username,
            password,
            root: {
                create: {
                   name: "root", 
                },
            },
        }
    });
}

const getRootId = async (userId) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        }
    });
    return user.rootId;
}
module.exports = {
    insertUser,
    getRootId,
}