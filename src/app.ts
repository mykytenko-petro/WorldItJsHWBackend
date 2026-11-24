import cookieParser from "cookie-parser";
import cors, { type CorsOptions } from "cors";
import express from "express";
import {
    hashRefreshToken,
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
} from "./lib/jwt";
import { hashPassword, verifyPassword } from "./lib/password";
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

// config
const PORT = 8000;
const HOST = "localhost";

const corsOptions: CorsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

// app
const app = express();

// composition root
// middleware
const requireAuth = createRequireAuth(verifyAccessToken);

// layers
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
    {
        hashPassword: hashPassword,
        verifyPassword: verifyPassword,
    },
    {
        signAccessToken: signAccessToken,
        signRefreshToken: signRefreshToken,
    },
    {
        verifyAccessToken: verifyAccessToken,
        verifyRefreshToken: verifyRefreshToken,
    },
    {
        hashRefreshToken,
    },
);
const userHandler = createUserHandler(userService);
const userRouter = createUserRouter(userHandler, requireAuth);

// middleware connection
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

// router connection
app.use("/", postRouter);
app.use("/", categoriesRouter);
app.use("/", userRouter);

// listening
app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
