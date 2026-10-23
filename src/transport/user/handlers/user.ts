import type { UserServiceContract } from "../../../services/user/user.types";
import type { UserHandlerContract } from "./user.types";
import {
    DuplicateError,
    InvalidCredentialsError,
    NotFoundError,
} from "../../../domain/shared/errors";
import { ValidationError } from "yup";
import { validateLoginBody, validateRegisterBody } from "../dto/validation";

export function createUserHandler(
    service: UserServiceContract,
): UserHandlerContract {
    return {
        async register(req, res) {
            try {
                const { email, password } = await validateRegisterBody(
                    req.body,
                );

                const user = await service.register(email, password);

                res.status(201).json(user);
            } catch (error) {
                if (error instanceof ValidationError) {
                    res.status(422).json({ error: error.message });
                } else if (error instanceof DuplicateError) {
                    res.status(409).json({ error: error.message });
                } else {
                    res.status(500).end();
                }
            }
        },

        async login(req, res) {
            try {
                const { email, password } = await validateLoginBody(req.body);

                const result = await service.login(email, password);

                res.cookie("token", result.token, {
                    httpOnly: true,
                    sameSite: "lax",
                    secure: process.env["NODE_ENV"] === "production",
                    maxAge: 15 * 60 * 1000,
                    path: "/",
                });

                res.status(200).json(result.user);
            } catch (error) {
                if (error instanceof ValidationError) {
                    res.status(422).json({ error: error.message });
                } else if (error instanceof InvalidCredentialsError) {
                    res.status(401).json({ error: "Invalid password." });
                } else if (error instanceof NotFoundError) {
                    res.status(404).json({ error: error.message });
                } else {
                    res.status(500).end();
                }
            }
        },
    };
}
