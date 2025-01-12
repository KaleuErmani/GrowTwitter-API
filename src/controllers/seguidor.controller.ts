import { Request, Response } from "express";
import { repository } from "../database/prisma.connection";

export class SeguidorController {
  // index -> lista os seguidores de um usuário
  public async index(request: Request, response: Response) {
    try {
      const { userId } = request.params;

      const user = await repository.user.findUnique({
        where: { id: userId },
        include: {
          seguidores: {
            select: {
              seguidorId: true,
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
        message: "Seguidores listados com sucesso.",
        data: user.seguidores,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao listar seguidores. Tente novamente.",
      });
    }
  }

  // store -> segue um usuário
  public async store(request: Request, response: Response) {
    try {
      const { userId } = request.params;
      const { followUserId } = request.body;

      if (!followUserId) {
        return response.status(400).json({
          success: false,
          code: response.statusCode,
          message: "O campo 'followUserId' é obrigatório.",
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

      const followUser = await repository.user.findUnique({
        where: { id: followUserId },
      });

      if (!followUser) {
        return response.status(400).json({
          success: false,
          code: response.statusCode,
          message: "O usuário a ser seguido não foi encontrado.",
        });
      }

      if (userId === followUserId) {
        return response.status(400).json({
          success: false,
          code: response.statusCode,
          message: "Você não pode seguir a si mesmo.",
        });
      }

      const existingFollower = await repository.seguidor.findFirst({
        where: {
          userId: followUserId,
          seguidorId: userId,
        },
      });

      if (existingFollower) {
        return response.status(400).json({
          success: false,
          code: response.statusCode,
          message: "Você já segue este usuário.",
        });
      }

      const newFollower = await repository.seguidor.create({
        data: {
          userId: followUserId,
          seguidorId: userId,
        },
        select: {
          id: true,
          userId: true,
          seguidorId: true,
        },
      });

      return response.status(201).json({
        success: true,
        code: response.statusCode,
        message: "Você está seguindo este usuário.",
        data: newFollower,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao seguir usuário.",
      });
    }
  }

  // show -> lista os usuários que o usuário está seguindo
  public async show(request: Request, response: Response) {
    try {
      const { userId } = request.params;

      const user = await repository.user.findUnique({
        where: { id: userId },
        include: {
          seguindo: {
            select: {
              userId: true,
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
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
        message: "Usuários seguidos encontrados.",
        data: user.seguindo,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao buscar usuários seguidos.",
      });
    }
  }

  // delete -> deixa de seguir um usuário
  public async delete(request: Request, response: Response) {
    try {
      const { userId, followUserId } = request.params;

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

      const followStatus = await repository.seguidor.findFirst({
        where: {
          userId: followUserId,
          seguidorId: userId,
        },
      });

      if (!followStatus) {
        return response.status(404).json({
          success: false,
          code: response.statusCode,
          message: "Você não segue este usuário.",
        });
      }

      const unfollow = await repository.seguidor.delete({
        where: {
          id: followStatus.id,
        },
      });

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Você deixou de seguir este usuário.",
        data: unfollow,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao deixar de seguir usuário.",
      });
    }
  }
}
