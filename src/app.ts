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

// middleware connection
app.use(express.json());

// router connection
app.use("/", postRouter);
app.use("/", categoriesRouter);

// listening
app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`)
});
