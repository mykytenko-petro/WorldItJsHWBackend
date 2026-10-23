import type { CategoriesRepositoryContract } from "../domain/categories/repository";
import type { Database } from "./types";
import { DuplicateError } from "../domain/shared/errors";

export function createCategoriesRepository(
    db: Database,
): CategoriesRepositoryContract {
    return {
        async getAllCategories() {
            return await db.orm.public.Category.all();
        },

        async getCategoryById(id) {
            return await db.orm.public.Category.where({ id }).first();
        },

        async addCategory(name) {
            try {
                return await db.orm.public.Category.create({
                    name: name,
                });
            } catch (error) {
                if (
                    error instanceof Error &&
                    "sqlState" in error &&
                    error.sqlState == "23505"
                ) {
                    throw new DuplicateError();
                }

                throw error;
            }
        },
    };
}
