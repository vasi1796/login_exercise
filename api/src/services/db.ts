import {PrismaClient} from '@prisma/client';

class DB {
  prisma: PrismaClient;
  constructor() {
    this.prisma = new PrismaClient(
        {
          datasources:
            {
              db: {
                url: process.env.DB_URL,
              },
            },
        },
    );
  }
}

export default new DB();

