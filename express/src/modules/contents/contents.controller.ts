import db from "@/config/db";
import { asyncHandler } from "@/shared/utils/asyncHandler";
import fs from "fs/promises";
import path from "path";

export const getReadyTests = asyncHandler(async (req, res) => {
  // const readyTestsPath = path.join(__dirname, "data", "ready-tests.json");
  // const readyTests = await fs.readFile(readyTestsPath, "utf-8");
  const tests = await db.test.findMany({});
  res.status(200).json(tests);
});
