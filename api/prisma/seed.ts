import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient(
  {
    datasources: 
    {
      db: {
        url: "postgresql://postgres:postgres@db:5432/postgres?connect_timeout=300"
      }
    }
  }
)

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    user_password: '$argon2i$v=19$m=4096,t=3,p=1$ov7iDp6JMM9EAu4CmF+Arw$XcII/SgJ5nv0oNzUyAricEimWL8AOuU9wXUjj1x8bJ4',
    posts: {
      create: [
        {
          title: 'Join the Prisma Slack',
          content: 'https://slack.prisma.io',
          published: true,
        },
      ],
    },
  },
  {
    name: 'Nilu',
    email: 'nilu@prisma.io',
    user_password: '$argon2i$v=19$m=4096,t=3,p=1$ov7iDp6JMM9EAu4CmF+Arw$XcII/SgJ5nv0oNzUyAricEimWL8AOuU9wXUjj1x8bJ4',
    posts: {
      create: [
        {
          title: 'Follow Prisma on Twitter',
          content: 'https://www.twitter.com/prisma',
          published: true,
        },
      ],
    },
  },
  {
    name: 'Mahmoud',
    email: 'mahmoud@prisma.io',
    user_password: '$argon2i$v=19$m=4096,t=3,p=1$ov7iDp6JMM9EAu4CmF+Arw$XcII/SgJ5nv0oNzUyAricEimWL8AOuU9wXUjj1x8bJ4',
    posts: {
      create: [
        {
          title: 'Ask a question about Prisma on GitHub',
          content: 'https://www.github.com/prisma/prisma/discussions',
          published: true,
        },
        {
          title: 'Prisma on YouTube',
          content: 'https://pris.ly/youtube',
        },
      ],
    },
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
