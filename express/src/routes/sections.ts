import { Router } from "express";
import { asyncHandler } from "../lib/utils/asyncHandler";
import { auth, AuthRequest } from "../middlewares/auth";

const router = Router({ mergeParams: true });

router.post(
  "/:sectionId/start",
  auth(),
  asyncHandler(async (req: AuthRequest, res) => {
    res.status(501).json({ message: "Not Implemented" });
  }),
);

export default router;
