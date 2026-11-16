import type { UserEntity, SessionEntity } from "./entity";

export interface UserRepositoryContract {
    createUser: (email: string, password: string) => Promise<UserEntity>;
    getUserByEmail: (email: string) => Promise<UserEntity>;
    getUserById: (id: number) => Promise<UserEntity>;
}

export interface SessionRepositoryContract {
    create: (
        tokenHash: string,
        userId: number,
        expiresAt: Date,
    ) => Promise<void>;
    getByHash: (tokenHash: string) => Promise<SessionEntity>;
    update: (
        oldHash: string,
        newHash: string,
        expiresAt: Date,
    ) => Promise<void>;
    delete: (tokenHash: string) => Promise<void>;
}
