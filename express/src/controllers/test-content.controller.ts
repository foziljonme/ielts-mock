import { asyncHandler } from "@/lib/utils/asyncHandler";
import fs from "fs/promises";
import path from "path";

export const getReadyTests = asyncHandler(async (req, res) => {
  const readyTestsPath = path.join(__dirname, "..", "data", "ready-tests.json");
  const readyTests = await fs.readFile(readyTestsPath, "utf-8");
  res.status(200).json(JSON.parse(readyTests));
});
