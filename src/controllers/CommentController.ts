import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import VerifyComment from "../utils/CommentEvaluation";

const prisma = new PrismaClient();

class CommentController {
  constructor() {}

  // Listar comentários
  async listComments(req: Request, res: Response) {
    try {
      const comments = await prisma.comment.findMany();
      return res.status(200).json(comments);
    } catch (err) {
      console.error("Erro ao listar comentários:", err);
      return res.status(500).json({
        error: "Erro ao buscar os comentários.",
      });
    }
  }

  // Postar comentário
  async postComment(req: Request, res: Response) {
    const { content, ...rest } = req.body;

    if (!content) {
      return res.status(400).json({
        status: 400,
        message: "O comentário deve conter conteúdo.",
      });
    }

    try {
      const response = await VerifyComment(content);

      if (response === "true") {
        return res.status(400).json({
          status: 400,
          message: "Comentário considerado ofensivo.",
        });
      }

      const newComment = await prisma.comment.create({
        data: { content, ...rest },
      });

      return res.status(201).json({
        status: 201,
        message: "Comentário postado com sucesso.",
        comment: newComment,
      });
    } catch (err) {
      console.error("Erro ao postar comentário:", err);
      return res.status(500).json({
        error: "Erro ao postar o comentário.",
      });
    }
  }

  // Deletar comentário
  async deleteComment(req: Request, res: Response) {
    const commentId = parseInt(req.params.id);

    if (isNaN(commentId)) {
      return res.status(400).json({
        status: 400,
        message: "ID de comentário inválido.",
      });
    }

    try {
      await prisma.comment.delete({
        where: { id: commentId },
      });

      return res.status(204).json({
        status: 204,
        message: "Comentário deletado com sucesso.",
      });
    } catch (err) {
      console.error("Erro ao deletar comentário:", err);
      return res.status(500).json({
        error: "Erro ao deletar o comentário.",
      });
    }
  }

  // Editar comentário
  async editComment(req: Request, res: Response) {
    const { content, ...rest } = req.body;
    const commentId = parseInt(req.params.id);

    if (isNaN(commentId)) {
      return res.status(400).json({
        status: 400,
        message: "ID de comentário inválido.",
      });
    }

    if (!content) {
      return res.status(400).json({
        status: 400,
        message: "O comentário deve conter conteúdo.",
      });
    }

    try {
      const updatedComment = await prisma.comment.update({
        where: { id: commentId },
        data: { content, ...rest },
      });

      return res.status(200).json({
        status: 200,
        message: "Comentário atualizado com sucesso.",
        comment: updatedComment,
      });
    } catch (err) {
      console.error("Erro ao atualizar comentário:", err);
      return res.status(500).json({
        error: "Erro ao atualizar o comentário.",
      });
    }
  }
}

export default new CommentController();
