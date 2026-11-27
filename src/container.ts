import type { Config } from "./config";
import { createTokenSigner } from "./lib/jwt";
import { createPasswordHasher } from "./lib/password";
import { db } from "./prisma/db";
import { createCategoriesRepository } from "./repositories/categories";
import { createPostRepository } from "./repositories/post";
import {
    createSessionRepository,
    createUserRepository,
} from "./repositories/user";
import { createCategoriesRouter } from "./routers/categories";
import { createPostRouter } from "./routers/post";
import { createUserRouter } from "./routers/user";
import { createCategoriesService } from "./services/categories/categories";
import { createPostService } from "./services/post/post";
import { createUserService } from "./services/user/user";
import { createCategoriesHandler } from "./transport/categories/handlers/categories";
import { createPostHandler } from "./transport/post/handlers/post";
import { createUserHandler } from "./transport/user/handlers/user";
import { createRequireAuth } from "./transport/user/middleware/request-auth";

export function createContainer(config: Config) {
    // lib
    const passwordHasher = createPasswordHasher(config.passwordPepper);
    const tokenSigner = createTokenSigner(
        config.jwtAccessSecret,
        config.jwtRefreshSecret,
    );

    // middleware
    const requireAuth = createRequireAuth(tokenSigner.verifyAccessToken);

    // categories
    const categoriesRepository = createCategoriesRepository(db);
    const categoriesService = createCategoriesService(categoriesRepository);
    const categoriesHandler = createCategoriesHandler(categoriesService);
    const categoriesRouter = createCategoriesRouter(categoriesHandler);

    // post
    const postRepository = createPostRepository(db);
    const postService = createPostService(postRepository);
    const postHandler = createPostHandler(postService);
    const postRouter = createPostRouter(postHandler, requireAuth);

    // user
    const sessionRepository = createSessionRepository(db);
    const userRepository = createUserRepository(db);
    const userService = createUserService(
        userRepository,
        sessionRepository,
        passwordHasher,
        tokenSigner,
    );
    const userHandler = createUserHandler(userService);
    const userRouter = createUserRouter(userHandler, requireAuth);

    return {
        routers: {
            categoriesRouter,
            postRouter,
            userRouter,
        },
    };
}
