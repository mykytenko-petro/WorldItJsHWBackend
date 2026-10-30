import "dotenv/config";
import jwt from "jsonwebtoken";

const accessTokenSecret = process.env["JWT_ACCESS_SECRET"];
const refreshTokenSecret = process.env["JWT_REFRESH_SECRET"];

if (!accessTokenSecret) throw new Error("JWT_ACCESS_SECRET is not defined");
if (!refreshTokenSecret) throw new Error("JWT_REFRESH_SECRET is not defined");

export function signAccessToken(userId: number) {
    return jwt.sign({}, accessTokenSecret!, {
        algorithm: "HS256",
        subject: String(userId),
        expiresIn: "15m",
    });
}

export function signRefreshToken(userId: number) {
    return jwt.sign({ type: "refresh" }, refreshTokenSecret!, {
        algorithm: "HS256",
        subject: String(userId),
        expiresIn: "7d",
    });
}

export function verifyAccessToken(token: string) {
    try {
        const payload = jwt.verify(token, accessTokenSecret!, {
            algorithms: ["HS256"],
        });

        if (typeof payload === "string" || typeof payload.sub !== "string") {
            throw new Error();
        }

        const userId = Number(payload.sub);

        return userId;
    } catch {
        throw new Error("INVALID_ACCESS_TOKEN");
    }
}

export function verifyRefreshToken(token: string) {
    try {
        const payload = jwt.verify(token, refreshTokenSecret!, {
            algorithms: ["HS256"],
        });

        if (
            typeof payload === "string" ||
            typeof payload.sub !== "string" ||
            payload["type"] !== "refresh"
        ) {
            throw new Error();
        }

        const userId = Number(payload.sub);

        return userId;
    } catch (error) {
        throw new Error("INVALID_REFRESH_TOKEN");
    }
}
