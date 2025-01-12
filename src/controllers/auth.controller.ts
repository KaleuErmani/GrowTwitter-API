import { Request, Response } from "express";
import { repository } from "../database/prisma.connection";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export class AuthController {
  public async login(request: Request, response: Response) {
    try {
      // Entrada
      const { email, senha } = request.body;

      if (!email || !senha) {
        return response.status(400).json({
          success: false,
          code: response.statusCode,
          message: 'Os campos "email" e "senha" são obrigatórios.',
        });
      }

      const user = await repository.user.findFirst({
        where: {
          email,
        },
        select: {
          id: true,
          nome: true,
          username: true,
          email: true,
          senha: true,
        },
      });

      if (!user) {
        return response.status(401).json({
          success: false,
          code: response.statusCode,
          message: "Credenciais inválidas.",
        });
      }

      const isPasswordValid = await bcrypt.compare(senha, user.senha);

      if (!isPasswordValid) {
        return response.status(401).json({
          success: false,
          code: response.statusCode,
          message: "Credenciais inválidas.",
        });
      }

      const token = randomUUID();

      await repository.user.update({
        where: {
          id: user.id,
        },
        data: {
          token,
        },
      });

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Login realizado com sucesso.",
        data: {
          id: user.id,
          nome: user.nome,
          username: user.username,
          email: user.email,
          token,
        },
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao realizar login.",
      });
    }
  }
}
