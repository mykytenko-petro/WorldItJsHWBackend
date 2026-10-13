import type { CategoriesHandlerContract } from "./categories.types";
import type { CategoriesServiceContract } from "../../../services/categories/categories.types";
import { DuplicateError, NotFoundError } from "../../../domain/shared/errors";
import { ValidationError } from "yup";
import { validateCreateCategoryBody, validateGetCategoryByIdParams } from "../dto/validation";

export function createCategoriesHandler(service: CategoriesServiceContract): CategoriesHandlerContract {
    return {
        async getAllCategories(_, res) {
            const result = await service.getAllCategories();

            res.status(200).json(result);
        },

        async getCategoryById(req, res) {
            try {
                const { id } = await validateGetCategoryByIdParams(req.params);
                const result = await service.getCategoryById(id);

                res.status(200).json(result);
            } catch (error) {
                if (error instanceof ValidationError) {
                    res.status(422).json({
                        error: error.message
                    });
                } else if (error instanceof NotFoundError) {
                    res.status(404).json({
                        error: error.message
                    });
                } else {
                    res.status(500).end();
                }
            }
        },

        async createCategory(req, res) {
            try {
                const { name } = await validateCreateCategoryBody(req.body);

                try {
                    const result = await service.createCategory(name);
                    res.status(201).json(result);
                } catch (error) {
                    if (error instanceof DuplicateError) {
                        res.status(409).json({
                            error: `category with name: ${name} exists`
                        });
                    } else {
                        throw error;
                    }
                }
            } catch (error) {
                if (error instanceof ValidationError) {
                    res.status(422).json({
                        error: error.message
                    });
                } else if (error instanceof DuplicateError) {
                    res.status(409).json({
                        error: error.message
                    });
                } else {
                    if (error instanceof Error) {
                        res.status(500).json({
                            error: error.message
                        });
                    } else {
                        res.status(500).end();
                    }
                }
            }
        }
    };
}
