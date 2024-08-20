# Development

```bash

# bun --print process.env | grep 'PORT'

bun install

bun add --dev prisma
bun add @prisma/client
bunx prisma init

# bunx prisma migrate reset

bunx prisma migrate dev --name create-user-model
bunx prisma db seed

bun add @elysiajs/swagger

```
