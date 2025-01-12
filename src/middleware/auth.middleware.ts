import { NextFunction, Request, Response } from "express";
import { repository } from "../database/prisma.connection";

export async function ValidateToken(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const { authorization } = request.headers;
    const { userId } = request.params;

    if (!authorization) {
      return response.status(401).json({
        success: false,
        code: response.statusCode,
        message: "token de autentificação não informado.",
      });
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return response.status(401).json({
        success: false,
        code: response.statusCode,
        message: "Token inválido.",
      });
    }

    const user = await repository.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.token !== token) {
      return response.status(401).json({
        success: false,
        code: response.statusCode,
        message: "token de autentificação inválido.",
      });
    }

    next();
  } catch (error: any) {
    return response.status(500).json({
      success: false,
      code: response.statusCode,
      message: `Autentificação falhou: ${error.toString()}`,
    });
  }
}
