import { db } from "@/db";
import { InsertTeam, Team, teams } from "@/db/schema";
import { MakeOptional } from "@/types/utils";
import { eq } from "drizzle-orm";

export const createTeam = async (team: InsertTeam) => {
  return await db.insert(teams).values(team);
};

export const getTeamById = async (id: Team["id"]) => {
  return await db.select().from(teams).where(eq(teams.id, id));
};

type UpdateTeam = MakeOptional<InsertTeam>;
export const updateTeamById = async (id: Team["id"], update: UpdateTeam) => {
  return await db.update(teams).set(update).where(eq(teams.id, id));
};

export const getTeams = async (): Promise<Team[]> => {
  return await db.select().from(teams);
};
