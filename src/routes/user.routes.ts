import express from "express";
import { UserController } from "../controllers/user.controller";

const router = express.Router();

const userController = new UserController();

// Listar todos os usuarios
router.get("/usuarios", userController.index);

// Cadastrar um novo usuario
router.post("/usuarios", userController.store);

// Pesquisar um usuario por ID
router.get("/usuarios/:id", userController.show);

// Atualiza um usuario
router.put("/usuarios/:id", userController.update);

// Exclui um usuario
router.delete("/usuarios/:id", userController.delete);

export default router;
