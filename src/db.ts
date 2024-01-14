import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai';

const prismaClientSingleton = () => {
  return new PrismaClient({
    // log: ['query']
  })
}

const openAiSingleTon = () => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
  var openAi: undefined | ReturnType<typeof openAiSingleTon>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()
const openAi = globalThis.openAi ?? openAiSingleTon()

export { prisma, openAi }

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
if (process.env.NODE_ENV !== 'production') globalThis.openAi = openAi