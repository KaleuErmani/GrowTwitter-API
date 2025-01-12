import { repository } from "../database/prisma.connection";
import { Request, Response } from "express";
import { Reply } from "../models/replies.model";

export class ReplyController {
  // index -> lista todas as respostas para um tweet
  public async index(request: Request, response: Response) {
    try {
      const { tweetId } = request.params;

      const tweet = await repository.tweet.findUnique({
        where: { id: tweetId },
        include: {
          replies: {
            select: {
              id: true,
              conteudo: true,
              tipo: true,
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
        message: "Respostas listadas com sucesso.",
        data: tweet.replies,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao listar respostas. Tente novamente.",
      });
    }
  }

  // store -> posta uma resposta
  public async store(request: Request, response: Response) {
    try {
      const { userId } = request.params;
      const { tweetId, conteudo, tipo } = request.body;

      if (!conteudo || !tipo || !tweetId) {
        return response.status(400).json({
          success: false,
          code: response.statusCode,
          message: "Os campos 'conteudo', 'tipo' e 'tweetId' são obrigatórios.",
        });
      }

      const user = await repository.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return response.status(400).json({
          success: false,
          code: response.statusCode,
          message: "O usuário não foi encontrado.",
        });
      }

      const tweet = await repository.tweet.findUnique({
        where: { id: tweetId },
      });

      if (!tweet) {
        return response.status(404).json({
          success: false,
          code: response.statusCode,
          message: "Tweet não encontrado.",
        });
      }

      const newReply = new Reply(conteudo, tipo, userId, tweetId);

      const createdReply = await repository.reply.create({
        data: {
          id: newReply.id,
          conteudo: newReply.conteudo,
          tipo: newReply.tipo,
          userId: newReply.userId,
          tweetId: newReply.tweetId,
        },
        select: {
          id: true,
          conteudo: true,
          tipo: true,
          userId: true,
          tweetId: true,
        },
      });

      return response.status(201).json({
        success: true,
        code: response.statusCode,
        message: "Resposta criada com sucesso.",
        data: createdReply,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao criar resposta.",
      });
    }
  }

  // show -> lista uma resposta de um tweet
  public async show(request: Request, response: Response) {
    try {
      const { tweetId, replyId } = request.params;
      const reply = await repository.reply.findFirst({
        where: {
          id: replyId,
          tweetId,
        },
        select: {
          id: true,
          conteudo: true,
          tipo: true,
          userId: true,
          tweetId: true,
        },
      });

      if (!reply) {
        return response.status(404).json({
          success: false,
          code: response.statusCode,
          message: "Resposta não encontrada.",
        });
      }

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Resposta encontrada com sucesso.",
        data: reply,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao buscar resposta.",
      });
    }
  }

  // update -> edita uma resposta
  public async update(request: Request, response: Response) {
    try {
      const { tweetId, replyId } = request.params;
      const { conteudo, tipo } = request.body;

      if (!conteudo || !tipo) {
        return response.status(400).json({
          success: false,
          code: response.statusCode,
          message: "Os campos 'conteudo' e 'tipo' são obrigatórios.",
        });
      }

      const reply = await repository.reply.findFirst({
        where: {
          id: replyId,
          tweetId,
        },
      });

      if (!reply) {
        return response.status(404).json({
          success: false,
          code: response.statusCode,
          message: "Resposta não encontrada.",
        });
      }

      const updatedReply = await repository.reply.update({
        where: { id: replyId },
        data: {
          conteudo,
          tipo,
        },
        select: {
          id: true,
          conteudo: true,
          tipo: true,
          userId: true,
          tweetId: true,
        },
      });

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Resposta atualizada com sucesso.",
        data: updatedReply,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao atualizar resposta.",
      });
    }
  }

  // delete -> deleta uma resposta
  public async delete(request: Request, response: Response) {
    try {
      const { tweetId, replyId } = request.params;

      const reply = await repository.reply.findFirst({
        where: {
          id: replyId,
          tweetId,
        },
      });

      if (!reply) {
        return response.status(404).json({
          success: false,
          code: response.statusCode,
          message: "Resposta não encontrada.",
        });
      }

      const deletedReply = await repository.reply.delete({
        where: { id: replyId },
        select: {
          id: true,
          conteudo: true,
          tipo: true,
          userId: true,
          tweetId: true,
        },
      });

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Resposta deletada com sucesso.",
        data: deletedReply,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao deletar resposta.",
      });
    }
  }
}
