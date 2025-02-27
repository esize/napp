import { db } from "@/db";
import { InsertOrganization, Organization, organizations } from "@/db/schema";
import { MakeOptional } from "@/types/utils";
import { eq } from "drizzle-orm";

export const createOrganization = async (organization: InsertOrganization) => {
  return await db.insert(organizations).values(organization);
};

export const getOrganizationById = async (id: Organization["id"]) => {
  return await db.select().from(organizations).where(eq(organizations.id, id));
};

type UpdateOrganization = MakeOptional<InsertOrganization>;
export const updateOrganizationById = async (id: Organization["id"], update: UpdateOrganization) => {
  return await db.update(organizations).set(update).where(eq(organizations.id, id));
};