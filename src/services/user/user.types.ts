export interface PasswordHasherContract {
    hashPassword: (password: string) => Promise<string>;
    verifyPassword: (hash: string, password: string) => Promise<boolean>;
}

export interface TokenSignerContract {
    signAccessToken: (userId: number) => string;
}

export interface UserServiceContract {
    register: (
        email: string,
        password: string,
    ) => Promise<{
        id: number;
        email: string;
    }>;
    login: (
        email: string,
        password: string,
    ) => Promise<{
        user: {
            id: number;
            email: string;
        };
        token: string;
    }>;
}
