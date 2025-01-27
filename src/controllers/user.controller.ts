import { repository } from "../database/prisma.connection";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/users.model";

export class UserController {
  // index -> lista todos os usuarios
  public async index(request: Request, response: Response) {
    try {
      const users = await repository.user.findMany({
        select: {
          id: true,
          nome: true,
          email: true,
          username: true,
        },
      });

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Usuários listados com sucesso.",
        data: users,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao listar usuários.",
      });
    }
  }

  // store -> cria um novo usuario
  public async store(request: Request, response: Response) {
    try {
      const { nome, email, username, senha, imagemDePerfil } = request.body;

      if (!nome || !email || !username || !senha) {
        return response.status(400).json({
          success: false,
          code: response.statusCode,
          message: "Preencha todos os campos obrigatórios.",
        });
      }

      const imagem = imagemDePerfil || undefined;

      const newUser = new User(nome, email, username, senha, imagemDePerfil);

      const hashedPassword = await bcrypt.hash(senha, 10);

      const createdUser = await repository.user.create({
        data: {
          id: newUser.id,
          nome: newUser.nome,
          email: newUser.email,
          username: newUser.username,
          senha: hashedPassword,
          imagemDePerfil: newUser.imagemDePerfil,
        },
        select: {
          id: true,
          nome: true,
          email: true,
          username: true,
          imagemDePerfil: true,
        },
      });

      return response.status(201).json({
        success: true,
        code: response.statusCode,
        message: "Usuário cadastrado com sucesso.",
        data: createdUser,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao cadastrar usuário.",
      });
    }
  }

  // show -> detalhes de um único usuario
  public async show(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const user = await repository.user.findUnique({
        where: { id },
        select: {
          id: true,
          nome: true,
          email: true,
          username: true,
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
        message: "Usuário encontrado com sucesso.",
        data: user,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao encontrar usuário.",
      });
    }
  }

  // update -> atualizar um usuario existente
  public async update(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { nome, email, username, senha } = request.body;

      const updatedUser = await repository.user.update({
        where: { id },
        data: { nome, email, username, senha },
        select: {
          id: true,
          nome: true,
          email: true,
          username: true,
        },
      });

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Usuário atualizado com sucesso.",
        data: updatedUser,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao atualizar usuário.",
      });
    }
  }

  // delete -> remover um usuario existente
  public async delete(request: Request, response: Response) {
    try {
      const { id } = request.params;

      const user = await repository.user.delete({
        where: { id },
        select: {
          id: true,
          nome: true,
          email: true,
          username: true,
        },
      });

      return response.status(200).json({
        success: true,
        code: response.statusCode,
        message: "Usuário removido com sucesso.",
        data: user,
      });
    } catch (error) {
      return response.status(500).json({
        success: false,
        code: response.statusCode,
        message: "Erro ao tentar remover usuário.",
      });
    }
  }
}
