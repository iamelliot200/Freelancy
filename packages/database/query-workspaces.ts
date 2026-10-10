import { db } from "./src";
import { workspaces } from "./src/schema";

async function main() {
  const result = await db.select().from(workspaces);
  console.log(JSON.stringify(result, null, 2));
}

main().catch(console.error);
