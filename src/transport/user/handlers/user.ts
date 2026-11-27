import { ValidationError } from "yup";
import {
    DuplicateError,
    InvalidCredentialsError,
    NotFoundError,
} from "../../../domain/shared/errors";
import type { UserServiceContract } from "../../../services/user/user.types";
import {
    clearUserTokens,
    readRefreshToken,
    setUserTokens,
} from "../../cookies/user";
import { validateLoginBody, validateRegisterBody } from "../dto/validation";
import type { UserHandlerContract } from "./user.types";

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
                }
            }
        },

        async login(req, res) {
            try {
                const { email, password } = await validateLoginBody(req.body);
                const result = await service.login(email, password);

                setUserTokens(res, result.accessToken, result.refreshToken);
                res.status(200).json(result.user);
            } catch (error) {
                if (error instanceof ValidationError) {
                    res.status(422).json({ error: error.message });
                } else if (
                    error instanceof InvalidCredentialsError ||
                    error instanceof NotFoundError
                ) {
                    res.status(401).json({
                        error: "Invalid email or password.",
                    });
                }
            }
        },

        async refresh(req, res) {
            const refreshToken = readRefreshToken(req);

            if (!refreshToken) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            try {
                const result = await service.refresh(refreshToken);

                setUserTokens(res, result.accessToken, result.refreshToken);
                res.status(200).json({ message: "Tokens updated" });
            } catch (error) {
                if (error instanceof InvalidCredentialsError) {
                    clearUserTokens(res);
                    res.status(401).json({ error: "Invalid refresh token" });
                }
            }
        },

        async me(_, res) {
            try {
                const rawUserId = res.locals["userId"];
                const userId =
                    typeof rawUserId === "number"
                        ? rawUserId
                        : typeof rawUserId === "string" &&
                            rawUserId.trim() !== ""
                          ? Number(rawUserId)
                          : NaN;

                if (!Number.isInteger(userId) || userId <= 0) {
                    res.status(401).json({ error: "Unauthorized" });
                    return;
                }

                const user = await service.me(userId);
                res.status(200).json(user);
            } catch (error) {
                if (error instanceof NotFoundError) {
                    res.status(404).json({ error: error.message });
                }
            }
        },

        async logout(req, res) {
            const refreshToken = readRefreshToken(req);

            if (!refreshToken) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            try {
                await service.logout(refreshToken);
                clearUserTokens(res);

                res.status(200).json({ message: "Logged out" });
            } catch (error) {
                if (error instanceof NotFoundError) {
                    clearUserTokens(res);
                    res.status(404).json({ error: error.message });
                }
            }
        },
    };
}
