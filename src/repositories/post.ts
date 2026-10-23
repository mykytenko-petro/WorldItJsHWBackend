import type { PostRepositoryContract } from "../domain/post/repository";
import { NotFoundError } from "../domain/shared/errors";
import type { Database } from "./types";

export function createPostRepository(db: Database): PostRepositoryContract {
    return {
        async getAllPosts(category, take) {
            const query = db.orm.public.Post.include("category");

            if (category && take) {
                const matchingCategory = await db.orm.public.Category.where({
                    name: category,
                }).first();

                if (!matchingCategory) {
                    return [];
                }

                return query
                    .where({ categoryId: matchingCategory.id })
                    .limit(take)
                    .all();
            }

            if (category) {
                const matchingCategory = await db.orm.public.Category.where({
                    name: category,
                }).first();

                if (!matchingCategory) {
                    return [];
                }

                return query.where({ categoryId: matchingCategory.id }).all();
            }

            if (take) {
                return query.limit(take).all();
            }

            return await query.all();
        },

        async getPostById(id: number) {
            return await db.orm.public.Post.where({ id }).first();
        },

        async addPost(title, content, author, categoryId) {
            const category = await db.orm.public.Category.where({
                id: categoryId,
            }).first();

            if (!category) {
                throw new NotFoundError();
            }

            return await db.orm.public.Post.create({
                title: title,
                content: content,
                author: author,
                categoryId: categoryId,
            });
        },
    };
}
