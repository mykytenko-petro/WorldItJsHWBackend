export interface UserEntity {
    id: number;

    email: string;
    password: string;
}

export interface SessionEntity {
    id: number;

    tokenHash: string;
    createdAt: Date;
    expiresAt: Date;
    
    userId: number;
}