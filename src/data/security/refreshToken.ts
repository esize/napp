import { db } from "@/db";
import { refreshTokens, InsertRefreshToken, RefreshToken } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function createRefreshTokenRecord(token: InsertRefreshToken) {
  return await db.insert(refreshTokens).values(token).returning();
}

export async function getRefreshTokenById(
  id: string
): Promise<RefreshToken | null> {
  const result = await db
    .select()
    .from(refreshTokens)
    .where(eq(refreshTokens.id, id));

  return result.length ? result[0] : null;
}

export async function markRefreshTokenAsUsed(id: string) {
  return await db
    .update(refreshTokens)
    .set({ used: true })
    .where(eq(refreshTokens.id, id));
}

export async function revokeRefreshToken(id: string) {
  return await db
    .update(refreshTokens)
    .set({ revoked: true })
    .where(eq(refreshTokens.id, id));
}

export async function revokeAllUserRefreshTokens(userId: string) {
  return await db
    .update(refreshTokens)
    .set({ revoked: true })
    .where(eq(refreshTokens.userId, userId));
}

export async function isRefreshTokenValid(id: string): Promise<boolean> {
  const result = await db
    .select()
    .from(refreshTokens)
    .where(
      and(
        eq(refreshTokens.id, id),
        eq(refreshTokens.used, false),
        eq(refreshTokens.revoked, false)
      )
    );

  return result.length > 0;
}
