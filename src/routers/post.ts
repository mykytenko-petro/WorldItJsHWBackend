import { Router } from "express";
import type { PostHandlerContract } from "../transport/post/handlers/post.types";

export function createPostRouter(handler: PostHandlerContract) {
    const postRouter = Router();
    
    postRouter.get("/posts", handler.getAllPosts);
    postRouter.get("/posts/:id", handler.getPostById);
    postRouter.post("/posts", handler.createPost);

    return postRouter;
}
