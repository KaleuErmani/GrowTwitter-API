import { repository } from "../database/prisma.connection";
import { Request, Response } from "express";
import { Tweet } from "../models/tweets.model";

export class TweetController {
  // index -> lista todos os tweets de um usuario
  public async index(request: Request, response: Response) {
    try {
      const { userId } = request.params;

      const user = await repository.user.findUnique({
        where: { id: userId },
        include: {
          tweets: {
            select: {
              id: true,
              conteudo: true,
              tipo: true,
              userId: true,
            },
          },
        },
      });

      if (!user) {
        return response.status(404).json({
          success: false,
          code: response.statusCode,
          message: "Usuário não encontrado.",
        });
      }

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Tweets listados com sucesso.",
        data: user.tweets,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao listar tweets. Tente novamente.",
      });
    }
  }

  // store -> posta um tweet
  public async store(request: Request, response: Response) {
    try {
      const { userId } = request.params;
      const { conteudo, tipo } = request.body;

      if (!conteudo || !tipo) {
        return response.status(400).json({
          success: false,
          code: response.statusCode,
          message: "Os campos 'conteudo' e 'tipo' são obrigatórios.",
        });
      }

      const user = await repository.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return response.status(400).json({
          success: false,
          code: response.statusCode,
          message: "Usuário não encontrado.",
        });
      }

      const newTweet = new Tweet(conteudo, tipo, userId);

      const createdTweet = await repository.tweet.create({
        data: {
          conteudo: newTweet.conteudo,
          tipo: newTweet.tipo,
          userId: newTweet.userId,
        },
        select: {
          id: true,
          conteudo: true,
          tipo: true,
          userId: true,
        },
      });

      return response.status(201).json({
        success: true,
        code: response.statusCode,
        message: "Tweet criado com sucesso.",
        data: createdTweet,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao criar tweet.",
      });
    }
  }

  // show -> lista um tweet de um usuario
  public async show(request: Request, response: Response) {
    try {
      const { userId, id } = request.params;

      const tweet = await repository.tweet.findFirst({
        where: {
          id,
          userId,
        },
        select: {
          id: true,
          conteudo: true,
          tipo: true,
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
        message: "Tweet encontrado com sucesso.",
        data: tweet,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao buscar tweet.",
      });
    }
  }

  // delete -> deleta um tweet
  public async delete(request: Request, response: Response) {
    try {
      const { userId, id } = request.params;

      const tweet = await repository.tweet.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!tweet) {
        return response.status(404).json({
          success: false,
          code: response.statusCode,
          message: "Tweet não encontrado.",
        });
      }

      const deletedTweet = await repository.tweet.delete({
        where: { id },
        select: {
          id: true,
          conteudo: true,
          tipo: true,
        },
      });

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Tweet deletado com sucesso.",
        data: deletedTweet,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao deletar Tweet.",
      });
    }
  }

  // update -> edita um tweet
  public async update(request: Request, response: Response) {
    try {
      const { userId, id } = request.params;
      const { conteudo, tipo } = request.body;

      if (!conteudo || !tipo) {
        return response.status(400).json({
          success: false,
          code: response.statusCode,
          message: 'Os campos "conteudo" e "tipo" são obrigatórios.',
        });
      }

      const tweet = await repository.tweet.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!tweet) {
        return response.status(404).json({
          success: false,
          code: response.statusCode,
          message: "Tweet não encontrado.",
        });
      }

      const updatedTweet = await repository.tweet.update({
        where: { id },
        data: {
          conteudo,
          tipo,
        },
        select: {
          id: true,
          conteudo: true,
          tipo: true,
        },
      });

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Tweet atualizado com sucesso.",
        data: updatedTweet,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao atualizar Tweet.",
      });
    }
  }

  // feed -> lista todos os tweets do usuario + usuarios segudios
  public async feed(request: Request, response: Response) {
    try {
      const { userId } = request.params;

      const user = await repository.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return response.status(404).json({
          success: false,
          code: response.statusCode,
          message: "Usuário não encontrado.",
        });
      }

      const seguindo = await repository.seguidor.findMany({
        where: { userId },
        select: { seguidorId: true },
      });

      const seguindoIds = seguindo.map((seguidor) => seguidor.seguidorId);
      seguindoIds.push(userId);

      const tweets = await repository.tweet.findMany({
        where: {
          userId: {
            in: seguindoIds,
          },
        },
        select: {
          id: true,
          conteudo: true,
          tipo: true,
          userId: true,
          user: {
            select: {
              id: true,
              nome: true,
              username: true,
            },
          },
        },
      });

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Feed carregado com sucesso.",
        data: tweets,
      });
    } catch (error) {
      console.error("Erro ao carregar o feed:", error);
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao carregar o feed. Tente novamente.",
      });
    }
  }
}
