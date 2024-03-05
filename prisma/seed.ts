const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    await prisma.$connect()
    await prisma.user.createMany({
        data: [
            {
                role: 'ADMIN',
                username: 'admin',
                password: 'admin_password'
            },
            {
                role: 'USER',
                username: 'user1',
                password: 'user1_password'
            },
            {
                role: 'USER',
                username: 'user2',
                password: 'user2_password'
            }
        ]
    });

    await prisma.product.createMany({
        data: [
            {
                name: 'Продукт 1',
                about: 'Описание продукта 1',
                price: 100.50,
                photos: ['photo1.jpg', 'photo2.jpg'],
                tags: ['тег1', 'тег2']
            },
            {
                name: 'Продукт 2',
                about: 'Описание продукта 2',
                price: 200.75,
                photos: ['photo3.jpg', 'photo4.jpg'],
                tags: ['тег2', 'тег3']
            },
            {
                name: 'Продукт 3',
                about: 'Описание продукта 3',
                price: 150.25,
                photos: ['photo5.jpg', 'photo6.jpg'],
                tags: ['тег1', 'тег3']
            },
            {
                name: 'Продукт 4',
                about: 'Описание продукта 4',
                price: 75.90,
                photos: ['photo7.jpg', 'photo8.jpg'],
                tags: ['тег3']
            },
        ]
    });

    await prisma.tag.createMany({
        data: [
            { name: 'тег1' },
            { name: 'тег2' },
            { name: 'тег3' }
        ]
    });

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
