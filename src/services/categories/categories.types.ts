import type { CategoryEntity } from "../../domain/categories/entity";

export interface CategoriesServiceContract {
    getAllCategories: () => Promise<CategoryEntity[]>;
    getCategoryById: (id: number) => Promise<CategoryEntity>;
    createCategory: (name: string) => Promise<CategoryEntity>;
}