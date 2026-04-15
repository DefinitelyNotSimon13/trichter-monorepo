import { authClient } from "#/lib/auth-client";

export type AdminListUsersParams = {
  limit: number;
  offset: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  searchValue?: string;
  searchField?: string;
  searchOperator?: "contains" | "starts_with" | "ends_with" | "eq";
  filterField?: string;
  filterValue?: string | number | boolean | string[] | number[];
  filterOperator?:
    | "eq"
    | "ne"
    | "lt"
    | "lte"
    | "gt"
    | "gte"
    | "in"
    | "not_in"
    | "contains"
    | "starts_with"
    | "ends_with";
};

export async function listUsers(params: AdminListUsersParams) {
  const { data, error } = await authClient.admin.listUsers({
    query: params,
  });

  if (error) throw new Error(error.message || "Failed to list users");
  return data;
}

export async function createUser(input: {
  email: string;
  password: string;
  name: string;
  role?: string | string[];
  username?: string;
  data?: Record<string, unknown>;
}) {
  const { data, error } = await authClient.admin.createUser(input);
  if (error) throw new Error(error.message || "Failed to create user");
  return data;
}

export async function updateUser(input: {
  userId: string;
  data: Record<string, unknown>;
}) {
  const { data, error } = await authClient.admin.updateUser(input);
  if (error) throw new Error(error.message || "Failed to update user");
  return data;
}

export async function setRole(input: {
  userId: string;
  role: string | string[];
}) {
  const { data, error } = await authClient.admin.setRole(input);
  if (error) throw new Error(error.message || "Failed to set role");
  return data;
}

export async function setUserPassword(input: {
  userId: string;
  newPassword: string;
}) {
  const { data, error } = await authClient.admin.setUserPassword(input);
  if (error) throw new Error(error.message || "Failed to set password");
  return data;
}

export async function banUser(input: {
  userId: string;
  banReason?: string;
  banExpiresIn?: number;
}) {
  const { error } = await authClient.admin.banUser(input);
  if (error) throw new Error(error.message || "Failed to ban user");
}

export async function unbanUser(input: { userId: string }) {
  const { error } = await authClient.admin.unbanUser(input);
  if (error) throw new Error(error.message || "Failed to unban user");
}

export async function listUserSessions(input: { userId: string }) {
  const { data, error } = await authClient.admin.listUserSessions(input);
  if (error) throw new Error(error.message || "Failed to load sessions");
  return data;
}

export async function revokeUserSession(input: { sessionToken: string }) {
  const { data, error } = await authClient.admin.revokeUserSession(input);
  if (error) throw new Error(error.message || "Failed to revoke session");
  return data;
}

export async function revokeUserSessions(input: { userId: string }) {
  const { data, error } = await authClient.admin.revokeUserSessions(input);
  if (error) throw new Error(error.message || "Failed to revoke sessions");
  return data;
}

export async function impersonateUser(input: { userId: string }) {
  const { data, error } = await authClient.admin.impersonateUser(input);
  if (error) throw new Error(error.message || "Failed to impersonate user");
  return data;
}

export async function removeUser(input: { userId: string }) {
  const { data, error } = await authClient.admin.removeUser(input);
  if (error) throw new Error(error.message || "Failed to delete user");
  return data;
}
