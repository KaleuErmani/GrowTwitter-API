import { Router } from "express";
import { LikeController } from "../controllers/like.controller";
import { ValidateToken } from "../middleware/auth.middleware";

const router = Router();
const likeController = new LikeController();

// Usando o middleware ValidateToken para verificar o token antes de chamar os métodos
router.get("/likes/:tweetId", likeController.show);
router.post("/likes/:userId/:tweetId", ValidateToken, likeController.store);
router.delete("/likes/:userId/:tweetId", ValidateToken, likeController.delete);

export default router;
