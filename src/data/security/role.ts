import { db } from "@/db";
import { InsertRole, Role, roles } from "@/db/schema";
import { MakeOptional } from "@/types/utils";
import { eq } from "drizzle-orm";

export const createRole = async (role: InsertRole) => {
  return await db.insert(roles).values(role);
};

export const getRoleById = async (id: Role["id"]) => {
  return await db.select().from(roles).where(eq(roles.id, id));
};

type UpdateRole = MakeOptional<InsertRole>;
export const updateRoleById = async (id: Role["id"], update: UpdateRole) => {
  return await db.update(roles).set(update).where(eq(roles.id, id));
};