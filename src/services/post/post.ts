import type { PostRepositoryContract } from "../../domain/post/repository";
import { NotFoundError } from "../../domain/shared/errors";
import type { PostServiceContract } from "./post.types";

export function createPostService(repository: PostRepositoryContract): PostServiceContract {
    return {
        async getAllPosts(category?: string, take?: number) {
            return repository.getAllPosts(category, take);
        },

        async getPostById(id: number) {
            const result = await repository.getPostById(id);

            if (!result) {
                throw new NotFoundError();
            }

            return result;
        },

        async createPost(
            title: string,
            content: string,
            author: string,
            categoryId: number
        ) {
            return repository.addPost(title, content, author, categoryId)
        }
    }
}
