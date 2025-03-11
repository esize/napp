import "server-only";
import { db } from "@/db";
import { InsertPermission, Permission, permissions } from "@/db/schema";
import { MakeOptional } from "@/types/utils";
import { eq } from "drizzle-orm";

export const createPermission = async (permission: InsertPermission) => {
  return await db.insert(permissions).values(permission).returning();
};

export const getPermissionById = async (id: Permission["id"]) => {
  return await db.select().from(permissions).where(eq(permissions.id, id));
};

type UpdatePermission = MakeOptional<InsertPermission>;
export const updatePermissionById = async (
  id: Permission["id"],
  update: UpdatePermission
) => {
  return await db
    .update(permissions)
    .set(update)
    .where(eq(permissions.id, id))
    .returning();
};
