import { db } from "./src";
import { workspaces, workspaceMembers } from "./src/schema/workspaces";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Checking workspaces...");
  const all = await db.select().from(workspaces);
  console.log("All workspaces:", JSON.stringify(all, null, 2));
  
  console.log("Deleting workspace with ID :id...");
  await db.delete(workspaceMembers).where(eq(workspaceMembers.workspaceId, ":id"));
  await db.delete(workspaces).where(eq(workspaces.id, ":id"));
  console.log("Deleted");
}

main().catch(console.error);
