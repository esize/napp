// src/db/seed/admin-seeder.ts
import {
  createPermission,
  createRole,
  assignRoleToUser,
  getRoles,
  assignPermissions,
  createUser,
} from "@/data";
import { hashPassword } from "@/lib/auth/password";
import { env } from "@/env";

export async function seedAdminRole() {
  // Create admin permissions
  const [createUserPermission] = await createPermission({
    name: "CREATE_USER",
    description: "Create new users in the system",
    resource: "USER",
    action: "CREATE",
  });

  const [manageUsersPermission] = await createPermission({
    name: "MANAGE_USERS",
    description: "View and manage user accounts",
    resource: "USER",
    action: "MANAGE",
  });

  // Create admin role
  const [adminRole] = await createRole({
    name: "SUPER_ADMIN",
    description: "System administrator with full access",
  });

  // Assign permissions to role (you'll need to add this function to your role data layer)
  assignPermissions(adminRole.id, [
    manageUsersPermission.id,
    createUserPermission.id,
  ]);

  console.log("Admin role and permissions created successfully");
}

export async function createInitialAdmin() {
  const adminPassword = env.INITIAL_ADMIN_PASSWORD || "password";
  const passwordHash = await hashPassword(adminPassword);

  // Create admin user
  const adminUser = await createUser({ username: "admin", passwordHash });

  // Get admin role
  const adminRoles = await getRoles();
  const adminRole = adminRoles.find((role) => role.name === "ADMIN");

  if (adminRole && adminUser) {
    // Assign admin role to user
    await assignRoleToUser(adminUser.id, adminRole.id);
    console.log("Admin user created successfully");
  }
}
