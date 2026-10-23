import type { PostEntity, PostWithRelationsEntity } from "./entity";

export interface PostRepositoryContract {
    getAllPosts: (
        category?: string,
        take?: number,
    ) => Promise<PostWithRelationsEntity[]>;
    getPostById: (id: number) => Promise<PostEntity | null>;
    addPost: (
        title: string,
        content: string,
        authorId: number,
        categoryId: number,
    ) => Promise<PostEntity>;
}
