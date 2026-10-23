import { Router } from "express";
import type { CategoriesHandlerContract } from "../transport/categories/handlers/categories.types";

export function createCategoriesRouter(handler: CategoriesHandlerContract) {
    const postRouter = Router();

    postRouter.get("/categories", handler.getAllCategories);
    postRouter.get("/categories/:id", handler.getCategoryById);
    postRouter.post("/categories", handler.createCategory);

    return postRouter;
}
