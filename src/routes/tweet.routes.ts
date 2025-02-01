import express from "express";
import { TweetController } from "../controllers/tweet.controller";
import { ValidateToken } from "../middleware/auth.middleware";

const router = express.Router();

const tweetController = new TweetController();

// index -> lista todos os tweets de um usuario
router.get("/usuarios/:userId/tweets", ValidateToken, tweetController.index);

// store -> posta uma tweet
router.post("/usuarios/:userId/tweets", ValidateToken, tweetController.store);

// show -> lista um tweet de um usuario
router.get("/usuarios/:userId/tweets/:id", ValidateToken, tweetController.show);

//delete -> deleta um tweet
router.delete(
  "/usuarios/:userId/tweets/:id",
  ValidateToken,
  tweetController.delete
);

//update -> edita um tweet
router.put(
  "/usuarios/:userId/tweets/:id",
  ValidateToken,
  tweetController.update
);

//feed -. lista todos os tweets dos seguidores e do usuario
router.get("/usuarios/:userId/tweets/");

export default router;
