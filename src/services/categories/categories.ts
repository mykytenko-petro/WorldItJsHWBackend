import type { CategoriesRepositoryContract } from "../../domain/categories/repository";
import { NotFoundError } from "../../domain/shared/errors";
import type { CategoriesServiceContract } from "./categories.types";

export function createCategoriesService(repository: CategoriesRepositoryContract): CategoriesServiceContract {
    return {
        async getAllCategories() {
            return repository.getAllCategories();
        },

        async getCategoryById(id: number) {
            const result = await repository.getCategoryById(id);

            if (!result) {
                throw new NotFoundError();
            }

            return result
        },

        async createCategory(name) {
            return await repository.addCategory(name);
        }
    }
}
