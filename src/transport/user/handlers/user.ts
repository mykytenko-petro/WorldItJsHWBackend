import type { Response, CookieOptions } from "express";
import type { UserServiceContract } from "../../../services/user/user.types";
import type { UserHandlerContract } from "./user.types";
import {
    DuplicateError,
    InvalidCredentialsError,
    NotFoundError,
} from "../../../domain/shared/errors";
import { ValidationError } from "yup";
import { validateLoginBody, validateRegisterBody } from "../dto/validation";

const IS_PROD = process.env["NODE_ENV"] === "production";

const BASE_COOKIE_OPTIONS: CookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PROD,
};

function setAuthCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
) {
    res.cookie("accessToken", tokens.accessToken, {
        ...BASE_COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000,
        path: "/",
    });

    res.cookie("refreshToken", tokens.refreshToken, {
        ...BASE_COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    });
}

function clearAuthCookies(res: Response) {
    res.clearCookie("accessToken", { ...BASE_COOKIE_OPTIONS, path: "/" });
    res.clearCookie("refreshToken", { ...BASE_COOKIE_OPTIONS, path: "/auth" });
}

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

                setAuthCookies(res, result);
                res.status(200).json(result.user);
            } catch (error) {
                if (error instanceof ValidationError) {
                    res.status(422).json({ error: error.message });
                } else if (
                    error instanceof InvalidCredentialsError ||
                    error instanceof NotFoundError
                ) {
                    res.status(401).json({ error: "Invalid email or password." });
                }
            }
        },

        async refresh(req, res) {
            const refreshToken = req.cookies?.["refreshToken"];

            if (typeof refreshToken !== "string" || !refreshToken) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            try {
                const result = await service.refresh(refreshToken);

                setAuthCookies(res, result);
                res.status(200).json({ message: "Tokens updated" });
            } catch (error) {
                if (error instanceof InvalidCredentialsError) {
                    clearAuthCookies(res);
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
                        : typeof rawUserId === "string" && rawUserId.trim() !== ""
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
            const refreshToken = req.cookies?.["refreshToken"];

            if (typeof refreshToken !== "string" || !refreshToken) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            try {
                await service.logout(refreshToken);
                clearAuthCookies(res);

                res.status(200).json({ message: "Logged out" });
            } catch (error) {
                if (error instanceof NotFoundError) {
                    clearAuthCookies(res);
                    res.status(404).json({ error: error.message });
                }
            }
        },
    };
}