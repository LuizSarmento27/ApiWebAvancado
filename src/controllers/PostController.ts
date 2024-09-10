import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class PostController {
  constructor() {}

  // Listar posts
  async listPosts(req: Request, res: Response) {
    try {
      const posts = await prisma.post.findMany();
      return res.status(200).json(posts);
    } catch (err) {
      console.error("Erro ao listar posts:", err);
      return res.status(500).json({
        error: "Erro ao buscar posts",
      });
    }
  }

  // Criar post
  async createPost(req: Request, res: Response) {
    try {
    const postData = req.body;

    if (!postData.title) {
      return res.status(400).json({
        status: 400,
        message: "O campo 'título' é obrigatório.",
      });
    }

    if (!postData.content) {
      return res.status(400).json({
        status: 400,
        message: "O post deve ter um conteúdo.",
      });
    }
    
      const newPost = await prisma.post.create({
        data: postData,
      });

        res.status(201).json({
        status: 201,
        message: "Post criado com sucesso.",
        post: newPost,
      });
    } catch (err) {
      console.error("Erro ao criar post:", err);
      return res.status(500).json({
        status: 500,
        message: "Erro ao criar post.",
        error: err,
      });
    }
  }

  // Deletar post
  async deletePost(req: Request, res: Response) {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({
        status: 400,
        message: "ID do post inválido.",
      });
    }

    try {
      await prisma.post.delete({
        where: {
          id: postId,
        },
      });

      return res.status(200).json({
        status: 200,
        message: "Post deletado com sucesso.",
      });
    } catch (err) {
      console.error("Erro ao deletar post:", err);
      return res.status(500).json({
        status: 500,
        message: "Erro ao deletar post.",
        error: err,
      });
    }
  }

  // Editar post
  async editPost(req: Request, res: Response) {
    const postId = parseInt(req.params.id);
    const { title, content, ...rest } = req.body;

    if (isNaN(postId)) {
      return res.status(400).json({
        status: 400,
        message: "ID do post inválido.",
      });
    }

    if (!title) {
      return res.status(400).json({
        status: 400,
        message: "O campo 'título' é obrigatório.",
      });
    }

    if (!content) {
      return res.status(400).json({
        status: 400,
        message: "O post deve ter um conteúdo.",
      });
    }

    try {
      const updatedPost = await prisma.post.update({
        where: {
          id: postId,
        },
        data: { title, content, ...rest },
      });

      return res.status(200).json({
        status: 200,
        message: "Post atualizado com sucesso.",
        post: updatedPost,
      });
    } catch (err) {
      console.error("Erro ao atualizar post:", err);
      return res.status(500).json({
        status: 500,
        message: "Erro ao atualizar post.",
        error: err,
      });
    }
  }
}

export default new PostController();
