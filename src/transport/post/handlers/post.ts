import type { PostServiceContract } from "../../../services/post/post.types";
import type { PostHandlerContract } from "./post.types";
import {
    validateCreatePostBody,
    validateGetPostByIdParams,
    validateGetPostsQuery,
} from "../dto/validation";
import { ValidationError } from "yup";
import { NotFoundError } from "../../../domain/shared/errors";

export function createPostHandler(
    service: PostServiceContract,
): PostHandlerContract {
    return {
        async getAllPosts(req, res) {
            try {
                const { category, take } = await validateGetPostsQuery(
                    req.query,
                );
                const result = await service.getAllPosts(category, take);

                res.status(200).json(result);
            } catch (error) {
                if (error instanceof ValidationError) {
                    res.status(422).json({
                        error: error.message,
                    });
                } else {
                    res.status(500).end();
                }
            }
        },

        async getPostById(req, res) {
            try {
                const { id } = await validateGetPostByIdParams(req.params);
                const result = await service.getPostById(id);
                res.status(200).json(result);
            } catch (error) {
                if (error instanceof ValidationError) {
                    res.status(422).json({
                        error: error.message,
                    });
                } else if (error instanceof NotFoundError) {
                    res.status(404).json({
                        error: error.message,
                    });
                } else {
                    res.status(500).end();
                }
            }
        },

        async createPost(req, res) {
            try {
                const { title, content, author, categoryId } =
                    await validateCreatePostBody(req.body);

                const result = await service.createPost(
                    title,
                    content,
                    author,
                    categoryId,
                );

                res.status(201).json(result);
            } catch (error) {
                if (error instanceof ValidationError) {
                    res.status(422).json({
                        error: error.message,
                    });
                } else if (error instanceof NotFoundError) {
                    res.status(404).json({
                        error: error.message,
                    });
                } else {
                    res.status(500).end();
                }
            }
        },
    };
}
