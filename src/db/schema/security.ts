import { createTable } from "@/db/util/createTable";
import {
  boolean,
  index,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createId } from "../util/id";
import { organizations, teams } from "./core";

export const users = createTable(
  "users",
  {
    id: varchar("id", { length: 21 })
      .primaryKey()
      .$defaultFn(() => createId()),
    username: varchar("username", { length: 50 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    isActive: boolean("is_active").default(true),
    isLocked: boolean("is_locked").default(false),
    lastLogin: timestamp("last_login"),
  },
  (table) => [index("users_username_idx").on(table.username)]
);

export type User = typeof users.$inferSelect;
export type SanitizedUser = Omit<User, "passwordHash">;
export type InsertUser = typeof users.$inferInsert;

export const roles = createTable(
  "roles",
  {
    id: varchar("id", { length: 21 })
      .primaryKey()
      .$defaultFn(() => createId()),
    name: varchar("name", { length: 50 }).notNull().unique(),
    organizationId: varchar("organizationId", { length: 21 }).references(
      () => organizations.id
    ),
    description: text("description"),
  },
  (table) => [index("roles_organization_idx").on(table.organizationId)]
);
export type Role = typeof roles.$inferSelect;
export type InsertRole = typeof roles.$inferInsert;

export const permissions = createTable(
  "permissions",
  {
    id: varchar("id", { length: 21 })
      .primaryKey()
      .$defaultFn(() => createId()),
    name: varchar("name", { length: 50 }).notNull().unique(),
    description: text("description"),
    resource: varchar("resource", { length: 50 }).notNull(),
    action: varchar("action", { length: 50 }).notNull(),
  },
  (table) => [
    index("permissions_resource_action_idx").on(table.resource, table.action),
  ]
);
export type Permission = typeof permissions.$inferSelect;
export type InsertPermission = typeof permissions.$inferInsert;

export const userRoles = createTable(
  "user_roles",
  {
    userId: varchar("user_id", { length: 21 })
      .notNull()
      .references(() => users.id),
    roleId: varchar("role_id", { length: 21 })
      .notNull()
      .references(() => roles.id),
  },
  (table) => [
    primaryKey({
      name: "user_roles_pk",
      columns: [table.userId, table.roleId],
    }),
  ]
);
export type UserRole = typeof userRoles.$inferSelect;
export type InsertUserRole = typeof userRoles.$inferInsert;

export const rolePermissions = createTable(
  "role_permissions",
  {
    roleId: varchar("role_id", { length: 21 })
      .notNull()
      .references(() => roles.id),
    permissionId: varchar("permission_id", { length: 21 })
      .notNull()
      .references(() => permissions.id),
  },
  (table) => [
    primaryKey({
      name: "pk",
      columns: [table.roleId, table.permissionId],
    }),
  ]
);
export type RolePermission = typeof rolePermissions.$inferSelect;
export type InsertRolePermission = typeof rolePermissions.$inferInsert;

export const teamAccess = createTable(
  "team_access",
  {
    userId: varchar("user_id", { length: 21 })
      .notNull()
      .references(() => users.id),
    teamId: varchar("team_id", { length: 21 })
      .notNull()
      .references(() => teams.id),
    accessLevel: varchar("access_level", { length: 20 }).notNull(),
  },
  (table) => [
    primaryKey({
      name: "team_access_pk",
      columns: [table.userId, table.teamId],
    }),
  ]
);
export type TeamAccess = typeof teamAccess.$inferSelect;
export type InsertTeamAccess = typeof teamAccess.$inferInsert;

export const organizationAccess = createTable(
  "organization_access",
  {
    userId: varchar("user_id", { length: 21 })
      .notNull()
      .references(() => users.id),
    organizationId: varchar("organization_id", { length: 21 })
      .notNull()
      .references(() => organizations.id),
    accessLevel: varchar("access_level", { length: 20 }).notNull(),
  },
  (table) => [
    primaryKey({
      name: "organization_access_pk",
      columns: [table.userId, table.organizationId],
    }),
  ]
);
export type OrganizationAccess = typeof organizationAccess.$inferSelect;
export type InsertOrganizationAccess = typeof organizationAccess.$inferInsert;

export const securityLogs = createTable(
  "security_logs",
  {
    id: varchar("id", { length: 21 })
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: varchar("user_id", { length: 21 })
      .notNull()
      .references(() => users.id),
    action: varchar("action", { length: 50 }).notNull(),
    resource: varchar("resource", { length: 50 }).notNull(),
    details: text("details"),
    ipAddress: varchar("ip_address", { length: 50 }),
    timestamp: timestamp("timestamp").defaultNow(),
  },
  (table) => [
    index("security_logs_user_idx").on(table.userId),
    index("security_logs_timestamp_idx").on(table.timestamp),
  ]
);
export type InsertSecurityLog = typeof securityLogs.$inferInsert;
