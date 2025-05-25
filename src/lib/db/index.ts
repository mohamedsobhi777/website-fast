import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Environment variable validation
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
}

// Create the connection
const queryClient = postgres(databaseUrl);
export const db = drizzle(queryClient, { schema });

// Export schema for convenience
export { schema };
