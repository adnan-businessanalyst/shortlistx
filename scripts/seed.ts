import { config } from "dotenv";
config({ path: ".env.local" });
config();

import mongoose from "mongoose";
import { SEED_QUESTIONS } from "../src/lib/seed-questions";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is required");
    process.exit(1);
  }

  await mongoose.connect(uri);
  const col = mongoose.connection.collection("questions");
  const force = process.argv.includes("--force");

  const count = await col.countDocuments();
  if (count > 0 && !force) {
    console.log(`Questions already exist (${count}). Use --force to wipe and reseed.`);
    await mongoose.disconnect();
    return;
  }

  if (force) {
    await col.deleteMany({});
    console.log("Wiped questions collection.");
  }

  await col.insertMany(
    SEED_QUESTIONS.map((q) => ({
      ...q,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))
  );
  console.log(`Seeded ${SEED_QUESTIONS.length} questions.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
