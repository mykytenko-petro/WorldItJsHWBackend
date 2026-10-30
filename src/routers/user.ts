import { Router, type RequestHandler } from "express";
import type { UserHandlerContract } from "../transport/user/handlers/user.types";

export function createUserRouter(
    userHandler: UserHandlerContract,
    requireAuth: RequestHandler,
) {
    const userRouter = Router();

    userRouter.post("/register", userHandler.register);
    userRouter.post("/login", userHandler.login);
    userRouter.post("/refresh", userHandler.refresh);
    userRouter.get("/me", requireAuth, userHandler.me);

    return userRouter;
}
