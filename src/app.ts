import express from "express";
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
import { signAccessToken } from "./lib/jwt";

// config
const PORT = 8000;
const HOST = "localhost";

// app
const app = express();

// composition root
const categoriesRepository = createCategoriesRepository(db);
const categoriesService = createCategoriesService(categoriesRepository);
const categoriesHandler = createCategoriesHandler(categoriesService);
const categoriesRouter = createCategoriesRouter(categoriesHandler);

const postRepository = createPostRepository(db);
const postService = createPostService(postRepository);
const postHandler = createPostHandler(postService);
const postRouter = createPostRouter(postHandler);

const userRepository = createUserRepository(db);
const userService = createUserService(
    userRepository,
    { hashPassword, verifyPassword },
    { signAccessToken },
);
const userHandler = createUserHandler(userService);
const userRouter = createUserRouter(userHandler);

// middleware connection
app.use(express.json());

// router connection
app.use("/", postRouter);
app.use("/", categoriesRouter);
app.use("/", userRouter);

// listening
app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
