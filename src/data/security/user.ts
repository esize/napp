import { db } from "@/db";
import { type InsertUser, SanitizedUser, type User, users } from "@/db/schema";
import { MakeOptional } from "@/types/utils";
import { eq } from "drizzle-orm";

export const createUser = async (user: InsertUser) => {
  return await db.insert(users).values(user).returning({ id: users.id });
};

type WithOptionalPasswordHash<T> = T & { passwordHash?: string };
export const getUserById = async (id: User["id"]) => {
  const result = await db.select().from(users).where(eq(users.id, id));
  const user = { ...result[0] } as WithOptionalPasswordHash<SanitizedUser>;
  delete user.passwordHash;
  return user as SanitizedUser;
};

export const getUserByUsername = async (username: User["username"]) => {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  return { ...result[0] } as User;
};

type UpdateUser = MakeOptional<InsertUser>;
export const updateUserById = async (id: User["id"], update: UpdateUser) => {
  return await db.update(users).set(update).where(eq(users.id, id));
};

export const deactivateUser = async (id: User["id"]) => {
  return await db
    .update(users)
    .set({ isActive: false })
    .where(eq(users.id, id));
};
