import express from "express";
import { ReplyController } from "../controllers/reply.controller";
import { ValidateToken } from "../middleware/auth.middleware";

const router = express.Router();

const replyController = new ReplyController();

// Listar todas as respostas de um tweet
router.get("/tweets/:tweetId/respostas", ValidateToken, replyController.index);

// Criar uma nova resposta para um tweet
router.post(
  "/usuarios/:userId/respostas",
  ValidateToken,
  replyController.store
);

// Listar uma resposta específica de um tweet
router.get(
  "/tweets/:tweetId/respostas/:replyId",
  ValidateToken,
  replyController.show
);

// Editar uma resposta
router.put(
  "/tweets/:tweetId/respostas/:replyId",
  ValidateToken,
  replyController.update
);

// Deletar uma resposta
router.delete(
  "/tweets/:tweetId/respostas/:replyId",
  ValidateToken,
  replyController.delete
);

export default router;
