import type { Request, Response } from "express";
import * as cookies from "../../shared/constants/cookies";

export function setUserTokens(
    res: Response,
    accessToken: string,
    refreshToken: string,
) {
    res.cookie(cookies.ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env["NODE_ENV"] === "production",
        maxAge: 15 * 60 * 1000,
        path: "/",
    });
    res.cookie(cookies.REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env["NODE_ENV"] === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    });
}

export function clearUserTokens(res: Response) {
    res.clearCookie(cookies.ACCESS_TOKEN, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env["NODE_ENV"] === "production",
        path: "/",
    });
    res.clearCookie(cookies.REFRESH_TOKEN, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env["NODE_ENV"] === "production",
        path: "/",
    });
}

export function readAccessToken(req: Request) {
    const accessToken: unknown = req.cookies[cookies.ACCESS_TOKEN];
    return typeof accessToken === "string" ? accessToken : undefined;
}

export function readRefreshToken(req: Request) {
    const refreshToken: unknown = req.cookies[cookies.REFRESH_TOKEN];
    return typeof refreshToken === "string" ? refreshToken : undefined;
}
