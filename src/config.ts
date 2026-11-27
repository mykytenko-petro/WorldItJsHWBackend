function required(name: string) {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} is not defined`);
    }

    return value;
}

function optionalInt(name: string, fallback: number) {
    const raw = process.env[name];

    if (raw === undefined || raw === "") {
        return fallback;
    }

    const value = Number(raw);

    if (value <= 0 || !Number.isSafeInteger(value)) {
        throw new Error(`${name} must be positive integer`);
    }

    return value;
}

export function createConfig(): Config {
    return {
        databaseUrl: required("DATABASE_URL"),
        passwordPepper: Buffer.from(required("PASSWORD_PEPPER"), "hex"),
        jwtAccessSecret: required("JWT_ACCESS_SECRET"),
        jwtRefreshSecret: required("JWT_REFRESH_SECRET"),
        corsOrigin: required("CORS_ORIGIN"),
        serverPort: optionalInt("SERVER_PORT", 8000),
    };
}

export interface Config {
    databaseUrl: string;
    passwordPepper: Buffer;
    jwtAccessSecret: string;
    jwtRefreshSecret: string;
    corsOrigin: string;
    serverPort: number;
}
