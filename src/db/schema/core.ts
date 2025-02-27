import { createTable } from "@/db/util/createTable";
import { index, varchar } from "drizzle-orm/pg-core";
import { createId } from "../util/id";

export const teams = createTable("teams", {
    id: varchar("id", {length: 21}).primaryKey().$defaultFn(() => createId()),
    name: varchar('name', { length: 100 }).notNull(),
    teamType: varchar('team_type', { length: 20 }).notNull().default('Regular'),
    parentTeamId: varchar('parent_team_id', { length: 21 }),
}, (table) => [
    index("teams_name_idx").on(table.name),
    index("teams_parent_team_idx").on(table.parentTeamId),
])
export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;

export const organizations = createTable("organizations", {
    id: varchar("id", {length: 21}).primaryKey().$defaultFn(() => createId()),
    name: varchar('name', { length: 100 }).notNull()
}, (table) => [
    index("organizations_name_idx").on(table.name),
])
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = typeof organizations.$inferInsert;