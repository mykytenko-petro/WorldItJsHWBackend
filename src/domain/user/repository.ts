import type { UserEntity } from "./entity";

export interface UserRepositoryContract {
    createUser: (email: string, password: string) => Promise<UserEntity>;
    getUserByEmail: (email: string) => Promise<UserEntity>;
}
