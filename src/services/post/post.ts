import type { PostRepositoryContract } from "../../domain/post/repository";
import { NotFoundError } from "../../domain/shared/errors";
import type { PostServiceContract } from "./post.types";
import type { PostEntity } from "../../domain/post/entity";

export function createPostService(
    repository: PostRepositoryContract,
): PostServiceContract {
    return {
        async getAllPosts(
            category,
            take,
        ) {
            const posts = await repository.getAllPosts(category, take);

            return posts.map(({ user, ...post }) => ({
                ...post,
                user: user ? { id: user.id, email: user.email } : null,
            }));
        },

        async getPostById(id) {
            const result = await repository.getPostById(id);

            if (!result) {
                throw new NotFoundError();
            }

            return result;
        },

        async createPost(
            title,
            content,
            authorId,
            categoryId,
        ): Promise<PostEntity> {
            return repository.addPost(title, content, authorId, categoryId);
        },
    };
}
