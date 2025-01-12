import { repository } from "../database/prisma.connection";
import { Request, Response } from "express";

export class LikeController {
  // show -> lista todos os likes de um tweet
  public async show(request: Request, response: Response) {
    try {
      const { tweetId } = request.params;
      const tweet = await repository.tweet.findUnique({
        where: {
          id: tweetId,
        },
        include: {
          likes: {
            select: {
              id: true,
              userId: true,
              tweetId: true,
            },
          },
        },
      });

      if (!tweet) {
        return response.status(404).json({
          success: false,
          code: response.statusCode,
          message: "Tweet não encontrado.",
        });
      }

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Likes encontrados com sucesso.",
        data: tweet.likes,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao buscar likes do tweet.",
      });
    }
  }

  // store -> dar like em um tweet
  public async store(request: Request, response: Response) {
    try {
      const { userId, tweetId } = request.params;

      const existingLike = await repository.like.findFirst({
        where: {
          userId,
          tweetId,
        },
      });

      if (existingLike) {
        return response.status(400).json({
          success: false,
          code: response.statusCode,
          message: "Você já curtiu este tweet.",
        });
      }

      const createdLike = await repository.like.create({
        data: {
          userId,
          tweetId,
        },
        select: {
          id: true,
          userId: true,
          tweetId: true,
        },
      });

      return response.status(201).json({
        success: true,
        code: response.statusCode,
        message: "Você curtiu este tweet.",
        data: createdLike,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao curtir tweet.",
      });
    }
  }

  // delete -> retira o like de um tweet
  public async delete(request: Request, response: Response) {
    try {
      const { userId, tweetId } = request.params;

      const existingLike = await repository.like.findFirst({
        where: {
          tweetId,
          userId,
        },
      });

      if (!existingLike) {
        return response.status(404).json({
          success: false,
          code: response.statusCode,
          message: "Like não encontrado para este tweet.",
        });
      }

      const deletedLike = await repository.like.delete({
        where: { id: existingLike.id },
        select: {
          id: true,
        },
      });

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Você descurtiu este tweet.",
        data: deletedLike,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao descurtir tweet.",
      });
    }
  }
}
