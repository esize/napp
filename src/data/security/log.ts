import { db } from "@/db";
import { InsertSecurityLog, securityLogs } from "@/db/schema";

export const createSecurityLog = async (log: InsertSecurityLog) => {
    return await db.insert(securityLogs).values(log);
}