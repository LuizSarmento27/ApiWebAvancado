import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UserController {
  constructor() {}

  // Listar usuários
  async listUser(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany();
      return res.status(200).json(users);
    } catch (err) {
      console.error("Erro ao listar usuários:", err);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  // Criar novo usuário
  async createUser(req: Request, res: Response) {
    const { email, ...rest } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 400,
        message: "O campo 'email' é obrigatório.",
      });
    }

    try {
      const newUser = await prisma.user.create({
        data: { email, ...rest },
      });

      return res.status(201).json({
        status: 201,
        message: "Usuário criado com sucesso.",
        user: newUser,
      });
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      return res.status(500).json({
        status: 500,
        message: "Não foi possível criar o usuário.",
        error: err,
      });
    }
  }

  // Atualizar usuário
  async updateUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id);
    const updates = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({
        status: 400,
        message: "ID de usuário inválido.",
      });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updates,
      });

      return res.status(200).json({
        status: 200,
        message: "Usuário atualizado com sucesso.",
        user: updatedUser,
      });
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      return res.status(500).json({
        status: 500,
        message: "Não foi possível atualizar o usuário.",
        error: err,
      });
    }
  }

  // Deletar usuário
  async deleteUser(req: Request, res: Response) {
    const userId = parseInt(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({
        status: 400,
        message: "ID de usuário inválido.",
      });
    }

    try {
      await prisma.user.delete({
        where: { id: userId },
      });

      return res.status(200).json({
        status: 200,
        message: "Usuário deletado com sucesso.",
      });
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      return res.status(500).json({
        status: 500,
        message: "Não foi possível deletar o usuário.",
        error: err,
      });
    }
  }
}

export default new UserController();
