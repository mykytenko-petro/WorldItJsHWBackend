import type { Request, Response } from "express";
import type {
    NotFoundErrorResponse,
    ValidationErrorResponse,
} from "../../shared/dto/errors";
import type { GetCategoryByIdParams } from "../dto/requests";
import type { CategoriesResponse, CreateCategoryBody } from "../dto/responses";

export interface CategoriesHandlerContract {
    getAllCategories: (
        _req: Request,
        res: Response<CategoriesResponse[] | ValidationErrorResponse>,
    ) => void;

    getCategoryById: (
        req: Request<GetCategoryByIdParams>,
        res: Response<
            CategoriesResponse | ValidationErrorResponse | NotFoundErrorResponse
        >,
    ) => void;

    createCategory: (
        req: Request<unknown, unknown, CreateCategoryBody>,
        res: Response<CategoriesResponse | ValidationErrorResponse>,
    ) => void;
}
