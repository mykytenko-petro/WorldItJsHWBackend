import { DuplicateError, NotFoundError } from "../domain/shared/errors";
import type { UserRepositoryContract } from "../domain/user/repository";
import type { Database } from "./types.js";

export function createUserRepository(db: Database): UserRepositoryContract {
    return {
        async createUser(email, password) {
            try {
                return await db.orm.public.User.create({
                    email,
                    password,
                });
            } catch (error) {
                if (
                    error instanceof Error &&
                    "sqlState" in error &&
                    error.sqlState == "23505"
                ) {
                    throw new DuplicateError(`Email ${email} is already used!`);
                }

                throw error;
            }
        },

        async getUserByEmail(email) {
            const result = await db.orm.public.User.where({ email }).first();

            if (!result) {
                throw new NotFoundError(`User with email ${email} not found`);
            }

            return result;
        },
    };
}
