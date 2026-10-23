import type {
    PostEntity,
    PostWithRelationsEntity,
} from "../../domain/post/entity";
import type { UserEntity } from "../../domain/user/entity";

export type PostWithPublicRelationsEntity = Omit<
    PostWithRelationsEntity,
    "user"
> & {
    user: Omit<UserEntity, "password"> | null;
};

export interface PostServiceContract {
    getAllPosts: (
        category?: string,
        take?: number,
    ) => Promise<PostWithPublicRelationsEntity[]>;
    getPostById: (id: number) => Promise<PostEntity>;
    createPost: (
        title: string,
        content: string,
        authorId: number,
        categoryId: number,
    ) => Promise<PostEntity>;
}
