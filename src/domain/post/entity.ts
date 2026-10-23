import type { CategoryEntity } from "../categories/entity";
import type { UserEntity } from "../user/entity";

export interface PostEntity {
    id: number;

    title: string;
    content: string;
    author: string;

    categoryId: number | null;
    userId: number | null;
}

export interface PostWithRelationsEntity extends PostEntity {
    category: CategoryEntity | null;
    user: UserEntity | null;
}
