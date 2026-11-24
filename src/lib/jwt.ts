import "dotenv/config";
import { createHash, randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import type { TokenSignerContract } from "../services/user/user.types";

export function createTokenHasher(
    accessTokenSecret: string,
    refreshTokenSecret: string,
): TokenSignerContract {
    return {
        signAccessToken(userId) {
            return jwt.sign({}, accessTokenSecret, {
                algorithm: "HS256",
                subject: String(userId),
                expiresIn: "15m",
            });
        },

        signRefreshToken(userId) {
            return jwt.sign({ type: "refresh" }, refreshTokenSecret, {
                algorithm: "HS256",
                subject: String(userId),
                expiresIn: "7d",
                jwtid: randomUUID(),
            });
        },

        verifyAccessToken(token) {
            try {
                const payload = jwt.verify(token, accessTokenSecret, {
                    algorithms: ["HS256"],
                });
                if (
                    typeof payload === "string" ||
                    typeof payload.sub !== "string"
                ) {
                    throw new Error();
                }
                const userId = Number(payload.sub);
                return userId;
            } catch {
                throw new Error("INVALID_ACCESS_TOKEN");
            }
        },

        verifyRefreshToken(token) {
            try {
                const payload = jwt.verify(token, refreshTokenSecret, {
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
                console.log(error);
                throw new Error("INVALID_REFRESH_TOKEN");
            }
        },

        hashRefreshToken(token) {
            return createHash("sha256").update(token).digest("hex");
        },
    };
}
