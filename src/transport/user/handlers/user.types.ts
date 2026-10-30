import type { Request, Response } from "express";
import type { UserCredentialsBody } from "../dto/requests";
import type { UserResponse } from "../dto/responses";
import type {
    ConflictErrorResponse,
    InvalidCredentialsErrorResponse,
    NotFoundErrorResponse,
    ValidationErrorResponse,
} from "../../shared/dto/errors";

export interface UserHandlerContract {
    register: (
        req: Request<unknown, unknown, UserCredentialsBody>,
        res: Response<
            UserResponse | ValidationErrorResponse | ConflictErrorResponse
        >,
    ) => Promise<void>;
    login: (
        req: Request<unknown, unknown, UserCredentialsBody>,
        res: Response<
            | UserResponse
            | ValidationErrorResponse
            | NotFoundErrorResponse
            | InvalidCredentialsErrorResponse
        >,
    ) => Promise<void>;
    refresh: (req: Request, res: Response) => Promise<void>;
    me: (_req: Request, res: Response) => Promise<void>;
}
