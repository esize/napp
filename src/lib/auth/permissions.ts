import { checkUserPermission } from "@/data";

export async function userHasPermission(
  userId: string,
  resource: string,
  action: string
): Promise<boolean> {
  try {
    return await checkUserPermission(userId, resource, action);
  } catch (error) {
    console.error("Error checking user permission:", error);
    return false;
  }
}
