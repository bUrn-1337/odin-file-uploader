const { PrismaClient } = require("@prisma/client");


const prisma = new PrismaClient();

const insertUser = async (username, password) => {
    await prisma.user.create({
        data : {
            username,
            password
        }
    });
}