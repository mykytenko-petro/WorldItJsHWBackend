import type { PostEntity } from "./entity";

export interface PostRepositoryContract {
    getAllPosts: (category?: string, take?: number) => Promise<PostEntity[]>;
    getPostById: (id: number) => Promise<PostEntity | null>;
    addPost: (
        title: string,
        content: string,
        author: string,
        categoryId: number
    ) => Promise<PostEntity>;
}