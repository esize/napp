"use server";

import { db } from "@/db";
import { userRoles } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function userHasPermission(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  try {
    return await userHasPermission(userId, resource, action);
  } catch (error) {
    console.error("Error checking user permission:", error);
    return false;
  }
}

export async function assignRoleToUser(userId: string, roleId: string) {
  return await db.insert(userRoles).values({
    userId,
    roleId,
  });
}

export async function removeRoleFromUser(userId: string, roleId: string) {
  return await db
    .delete(userRoles)
    .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)));
}

export async function getUserRoles(userId: string) {
  const result = await db
    .select({
      roleId: userRoles.roleId,
    })
    .from(userRoles)
    .where(eq(userRoles.userId, userId));

  return result.map((r) => r.roleId);
}
