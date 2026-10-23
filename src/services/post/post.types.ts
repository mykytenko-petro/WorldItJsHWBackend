import type { PostEntity } from "../../domain/post/entity";

export interface PostServiceContract {
    getAllPosts: (category?: string, take?: number) => Promise<PostEntity[]>;
    getPostById: (id: number) => Promise<PostEntity>;
    createPost: (
        title: string,
        content: string,
        author: string,
        categoryId: number,
    ) => Promise<PostEntity>;
}
