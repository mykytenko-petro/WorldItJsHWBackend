import type { CategoryEntity } from "./entity";

export interface CategoriesRepositoryContract {
    getAllCategories: () => Promise<CategoryEntity[]>;
    getCategoryById: (id: number) => Promise<CategoryEntity | null>;
    addCategory: (
        name: string
    ) => Promise<CategoryEntity>;
}