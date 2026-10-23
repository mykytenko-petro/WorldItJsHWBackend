import { Router } from "express";
import type { UserHandlerContract } from "../transport/user/handlers/user.types";

export function createUserRouter(userHandler: UserHandlerContract) {
    const userRouter = Router();

    userRouter.post("/register", userHandler.register);
    userRouter.post("/login", userHandler.login);

    return userRouter;
}
