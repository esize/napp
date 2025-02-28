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
  users,
} from "@/db/schema";
import { MakeOptional } from "@/types/utils";
import { and, eq, inArray } from "drizzle-orm";

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
  // First, get the user's roles
  const userRoleIds = await getUserRoles(id);
  // Find permissions associated with the user's roles
  const permissionsResult = await db
    .select({
      permissionId: rolePermissions.permissionId,
    })
    .from(rolePermissions)
    .where(inArray(rolePermissions.roleId, userRoleIds));

  // Extract permission IDs
  const permissionIds = permissionsResult.map((p) => p.permissionId);
  return permissionIds;
};

export const checkUserPermission = async (
  id: User["id"],
  resource: string,
  action: string
) => {
  const permissionIds = await getUserPermissions(id);
  const permissionCheck = await db
    .select()
    .from(permissions)
    .where(
      and(
        inArray(permissions.id, permissionIds),
        eq(permissions.resource, resource),
        eq(permissions.action, action)
      )
    );

  return permissionCheck.length > 0;
};
