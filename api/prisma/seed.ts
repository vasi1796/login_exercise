import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient(
  {
    datasources: 
    {
      db: {
        url: process.env.DB_URL
      }
    }
  }
)

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    user_password: '$argon2i$v=19$m=4096,t=3,p=1$ov7iDp6JMM9EAu4CmF+Arw$XcII/SgJ5nv0oNzUyAricEimWL8AOuU9wXUjj1x8bJ4'
  },
  {
    name: 'Nilu',
    email: 'nilu@prisma.io',
    user_password: '$argon2i$v=19$m=4096,t=3,p=1$ov7iDp6JMM9EAu4CmF+Arw$XcII/SgJ5nv0oNzUyAricEimWL8AOuU9wXUjj1x8bJ4'
  },
  {
    name: 'Mahmoud',
    email: 'mahmoud@prisma.io',
    user_password: '$argon2i$v=19$m=4096,t=3,p=1$ov7iDp6JMM9EAu4CmF+Arw$XcII/SgJ5nv0oNzUyAricEimWL8AOuU9wXUjj1x8bJ4'
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
