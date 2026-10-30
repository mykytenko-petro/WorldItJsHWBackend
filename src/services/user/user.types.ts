export interface PasswordHasherContract {
    hashPassword: (password: string) => Promise<string>,
    verifyPassword: (hash: string, password: string) => Promise<boolean>
}

export interface TokenSignerContract {
    signAccessToken: (userId: number) => string,
    signRefreshToken: (userId: number) => string
}

export interface TokenVerifierContract {
    verifyAccessToken: (token: string) => number,
    verifyRefreshToken: (token: string) => number
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
        accessToken: string;
        refreshToken: string;
    }>;
    refresh: (refreshToken: string) => Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    me: (id: number) => Promise<{
        id: number;
        email: string;
    }>;
}
