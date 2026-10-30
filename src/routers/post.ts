import { Router, type RequestHandler } from "express";
import type { PostHandlerContract } from "../transport/post/handlers/post.types";

export function createPostRouter(
    handler: PostHandlerContract,
    requireAuth: RequestHandler,
) {
    const postRouter = Router();

    postRouter.get("/posts", handler.getAllPosts);
    postRouter.get("/posts/:id", handler.getPostById);
    postRouter.post("/posts", requireAuth, handler.createPost);

    return postRouter;
}
