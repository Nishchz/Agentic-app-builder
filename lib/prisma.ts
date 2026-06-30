

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  // 1. pg package se Pool create karein
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL! 
  });
  
  // 2. Us pool ko PrismaPg adapter mein pass karein
  const adapter = new PrismaPg(pool);
  
  // 3. Adapter ke sath PrismaClient return karein
  return new PrismaClient({ adapter });
}

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;