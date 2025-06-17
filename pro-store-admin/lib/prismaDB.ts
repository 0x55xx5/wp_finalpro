import { PrismaClient } from "@/app/generated/prisma";

declare global {
	var prisma: PrismaClient | undefined;
}

const prismaDB = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismaDB;

export default prismaDB;
