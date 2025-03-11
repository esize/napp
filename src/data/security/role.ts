"use server";
import { db } from "@/db";
import {
  InsertRole,
  Permission,
  Role,
  rolePermissions,
  roles,
} from "@/db/schema";
import { MakeOptional } from "@/types/utils";
import { eq } from "drizzle-orm";

export const createRole = async (role: InsertRole) => {
  return await db.insert(roles).values(role).returning();
};

export const getRoleById = async (id: Role["id"]) => {
  return await db.select().from(roles).where(eq(roles.id, id));
};

type UpdateRole = MakeOptional<InsertRole>;
export const updateRoleById = async (id: Role["id"], update: UpdateRole) => {
  return await db.update(roles).set(update).where(eq(roles.id, id));
};

export const getRoles = async (): Promise<Role[]> => {
  return await db.select().from(roles);
};

export const assignPermissions = async (
  roleId: Role["id"],
  permissions: Permission["id"][]
) => {
  const permissionMapping = permissions.map((perm) => ({
    roleId,
    permissionId: perm,
  }));
  return await db.insert(rolePermissions).values(permissionMapping);
};
