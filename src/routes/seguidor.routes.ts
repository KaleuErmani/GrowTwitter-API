import express from "express";
import { SeguidorController } from "../controllers/seguidor.controller";
import { ValidateToken } from "../middleware/auth.middleware";

const router = express.Router();

const seguidorController = new SeguidorController();

// Listar seguidores de um usuário
router.get(
  "/usuarios/:userId/seguidores",
  ValidateToken,
  seguidorController.index
);

// Seguir um usuário
router.post(
  "/usuarios/:userId/seguindo",
  ValidateToken,
  seguidorController.store
);

// Listar usuários que um usuário está seguindo
router.get(
  "/usuarios/:userId/seguindo",
  ValidateToken,
  seguidorController.show
);

// Deixar de seguir um usuário
router.delete(
  "/usuarios/:userId/seguindo/:followUserId",
  ValidateToken,
  seguidorController.delete
);

export default router;
