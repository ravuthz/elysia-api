import { PrismaClient, Prisma } from '@prisma/client';

const isDebug = Bun.env.DEBUG || false;

const prisma = new PrismaClient({
    log: isDebug ? ['query'] : [],
    errorFormat: 'minimal',
});

if (isDebug) {
    prisma.$on('query', (e: { query: string, params: any, duration: number }) => {
        console.log('= = = = = = =')
        console.log('Query: ' + e.query)
        console.log('Params: ' + e.params)
        console.log('Duration: ' + e.duration + 'ms')
    })
}

export default prisma;