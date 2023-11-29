import express from "express";
import { isAdmin, isUser, verifyToken } from "../middlewares/auth.middleware.js";
import { getResultsByUserId } from "../controllers/result.controller.js";

const router = express.Router();

router.get("/:quizId/:userId", [verifyToken, isAdmin], getResultsByUserId);
router.get("/:quizId", [verifyToken, isUser], getResultsByUserId);

export default router;
