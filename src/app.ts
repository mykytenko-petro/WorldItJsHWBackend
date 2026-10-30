import express from "express";
import cors, { type CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import { db } from "./prisma/db";
import { createPostRepository } from "./repositories/post";
import { createPostService } from "./services/post/post";
import { createPostHandler } from "./transport/post/handlers/post";
import { createPostRouter } from "./routers/post";
import { createCategoriesRepository } from "./repositories/categories";
import { createCategoriesService } from "./services/categories/categories";
import { createCategoriesHandler } from "./transport/categories/handlers/categories";
import { createCategoriesRouter } from "./routers/categories";
import { createUserRepository } from "./repositories/user";
import { createUserService } from "./services/user/user";
import { createUserHandler } from "./transport/user/handlers/user";
import { createUserRouter } from "./routers/user";
import { hashPassword, verifyPassword } from "./lib/password";
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from "./lib/jwt";
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
const categoriesRepository = createCategoriesRepository(db);
const categoriesService = createCategoriesService(categoriesRepository);
const categoriesHandler = createCategoriesHandler(categoriesService);
const categoriesRouter = createCategoriesRouter(categoriesHandler);

const postRepository = createPostRepository(db);
const postService = createPostService(postRepository);
const postHandler = createPostHandler(postService);
const postRouter = createPostRouter(postHandler, requireAuth);

const userRepository = createUserRepository(db);
const userService = createUserService(
    userRepository,
    {
        hashPassword: hashPassword,
        verifyPassword: verifyPassword
    },
    {
        signAccessToken: signAccessToken,
        signRefreshToken: signRefreshToken,
    },
    {
        verifyAccessToken: verifyAccessToken,
        verifyRefreshToken: verifyRefreshToken,
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
