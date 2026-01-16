import { NextRequest } from "next/server";
import { getUserFromRequest } from "../auth";
import { prisma } from "../prisma";
import { AuthenticationError, AuthorizationError } from "./errors";

/**
 * Require authentication for API route
 * Throws AuthenticationError if not authenticated
 */
export async function requireAuth(request: NextRequest) {
  const tokenData = getUserFromRequest(request);
  if (!tokenData) {
    throw new AuthenticationError();
  }
  return tokenData;
}

/**
 * Require admin role for API route
 * Throws AuthenticationError or AuthorizationError if not authorized
 */
export async function requireAdmin(request: NextRequest) {
  const tokenData = await requireAuth(request);

  const user = await prisma.user.findUnique({
    where: { id: tokenData.userId },
  });

  if (!user) {
    throw new AuthenticationError("User not found");
  }

  if (user.role !== "ADMIN") {
    throw new AuthorizationError("Admin access required");
  }

  return { tokenData, user };
}

/**
 * Get optional user from request (doesn't throw if not authenticated)
 */
export function getOptionalUser(request: NextRequest) {
  return getUserFromRequest(request);
}
