import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
import * as argon2 from 'argon2'

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
const app = express()

app.use(express.json())

app.post(`/signup`, async (req, res) => {
  const { name, email, password, posts } = req.body

  const user_password = await argon2.hash(`${password}${process.env.PROJECT_PEPPER}`)
  const postData = posts?.map((post: Prisma.PostCreateInput) => {
    return { title: post?.title, content: post?.content }
  })

  try {
    const result = await prisma.user.create({
      data: {
        name,
        email,
        user_password,
        posts: {
          create: postData,
        },
      },
    })
    res.json(result) 
  } catch (error) {
    res.status(403).end()
  }
})

app.post('/login', async (req,res)=>{
  const { email, password } = req.body
  const result = await prisma.user.findFirst({
    where: {email: email},
    select: {
      user_password: true
    }
  })
  if (result?.user_password) {
    const matches = await argon2.verify(result?.user_password, `${password}${process.env.PROJECT_PEPPER}`)
    if (matches){
      res.status(200).end()
    } else {
      res.status(403).end()
    }
  } else {
    res.status(404).end()
  }
})

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000`),
)
