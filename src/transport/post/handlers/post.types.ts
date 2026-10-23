import type {
    NotFoundErrorResponse,
    ValidationErrorResponse,
} from "../../shared/dto/errors";
import type {
    CreatePostBody,
    GetPostByIdParams,
    GetPostsQuery,
} from "../dto/requests";
import type { PostResponse } from "../dto/responses";
import type { Request, Response } from "express";

export interface PostHandlerContract {
    getAllPosts: (
        req: Request<unknown, unknown, unknown, GetPostsQuery>,
        res: Response<PostResponse[] | ValidationErrorResponse>,
    ) => void;

    getPostById: (
        req: Request<GetPostByIdParams>,
        res: Response<
            PostResponse | ValidationErrorResponse | NotFoundErrorResponse
        >,
    ) => void;

    createPost: (
        req: Request<unknown, unknown, CreatePostBody>,
        res: Response<PostResponse | ValidationErrorResponse>,
    ) => void;
}
