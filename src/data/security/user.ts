import { db } from "@/db";
import {
  type InsertUser,
  Permission,
  permissions,
  Role,
  rolePermissions,
  SanitizedUser,
  type User,
  userRoles,
  users as usersTable,
} from "@/db/schema";
import { MakeOptional } from "@/types/utils";
import { and, asc, count, eq } from "drizzle-orm";

export const createUser = async (user: InsertUser) => {
  const [insertedUser] = await db.insert(usersTable).values(user).returning();
  return insertedUser;
};

export const getUsers = async ({
  pageSize,
  pageIndex,
}: {
  pageSize: number;
  pageIndex: number;
}): Promise<{ users: SanitizedUser[]; userCount: number }> => {
  const { users, userCount } = await db.transaction(async (tx) => {
    const users = await tx
      .select({
        id: usersTable.id,
        username: usersTable.username,
        isActive: usersTable.isActive,
        isLocked: usersTable.isLocked,
        lastLogin: usersTable.lastLogin,
      })
      .from(usersTable)
      .orderBy(asc(usersTable.id))
      .limit(pageSize)
      .offset(pageSize * (pageIndex - 1));
    const userCount = await tx
      .select({ count: count() })
      .from(usersTable)
      .execute()
      .then((res) => res[0]?.count ?? 0);
    return { users, userCount };
  });
  return { users, userCount };
};

type WithOptionalPasswordHash<T> = T & { passwordHash?: string };
export const getUserById = async (id: User["id"]) => {
  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id));
  const user = { ...result[0] } as WithOptionalPasswordHash<SanitizedUser>;
  delete user.passwordHash;
  return user as SanitizedUser;
};

export const getUserByUsername = async (username: User["username"]) => {
  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.username, username));
  return { ...result[0] } as User;
};

type UpdateUser = MakeOptional<InsertUser>;
export const updateUserById = async (id: User["id"], update: UpdateUser) => {
  return (
    await db
      .update(usersTable)
      .set(update)
      .where(eq(usersTable.id, id))
      .returning()
  )[0];
};

export const deactivateUser = async (id: User["id"]) => {
  return (
    await db
      .update(usersTable)
      .set({ isActive: false })
      .where(eq(usersTable.id, id))
      .returning()
  )[0];
};

export const getUserRoles = async (id: User["id"]): Promise<Role["id"][]> => {
  const userRolesResult = await db
    .select()
    .from(userRoles)
    .where(eq(userRoles.userId, id));

  const roleIds = userRolesResult.map((ur) => ur.roleId);
  return roleIds;
};

export const getUserPermissions = async (
  id: User["id"]
): Promise<Permission["id"][]> => {
  // Single query using joins to get all permissions for a user's roles
  const permissionsResult = await db
    .select({
      permissionId: permissions.id,
    })
    .from(userRoles)
    .innerJoin(rolePermissions, eq(userRoles.roleId, rolePermissions.roleId))
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(eq(userRoles.userId, id))
    .groupBy(permissions.id); // Ensure distinct permissions if a user has multiple roles with the same permission

  // Extract permission IDs
  return permissionsResult.map((p) => p.permissionId);
};

export const checkUserPermission = async (
  id: User["id"],
  resource: string,
  action: string
) => {
  const result = await db
    .select({ permissionId: permissions.id })
    .from(userRoles)
    .innerJoin(rolePermissions, eq(userRoles.roleId, rolePermissions.roleId))
    .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
    .where(
      and(
        eq(userRoles.userId, id),
        eq(permissions.resource, resource),
        eq(permissions.action, action)
      )
    )
    .limit(1); // We only need to know if at least one permission exists

  return result.length > 0;
};

export async function assignRoleToUser(userId: string, roleId: string) {
  return (
    await db
      .insert(userRoles)
      .values({
        userId,
        roleId,
      })
      .returning()
  )[0];
}

export async function removeRoleFromUser(userId: string, roleId: string) {
  await db
    .delete(userRoles)
    .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)));
}
