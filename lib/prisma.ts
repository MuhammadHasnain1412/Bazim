import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Parse DATABASE_URL to extract connection parameters
function parseDatabaseUrl(url: string | undefined) {
  if (!url) {
    throw new Error("DATABASE_URL is not defined");
  }

  // Parse mysql://user:password@host:port/database
  const match = url.match(/^mysql:\/\/([^:]+):([^@]+)@([^:]+):?(\d+)?\/(.+)$/);

  if (!match) {
    throw new Error("Invalid DATABASE_URL format");
  }

  const [, user, password, host, port, database] = match;

  return {
    host,
    user,
    password,
    database,
    port: port ? parseInt(port, 10) : 3306,
  };
}

// Create the adapter with connection configuration
const connectionParams = parseDatabaseUrl(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb({
  host: connectionParams.host,
  user: connectionParams.user,
  password: connectionParams.password,
  database: connectionParams.database,
  port: connectionParams.port,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Handle connection errors
prisma
  .$connect()
  .then(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("Database connected successfully");
    }
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
