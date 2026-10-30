import { InvalidCredentialsError } from "../../domain/shared/errors";
import type { UserRepositoryContract } from "../../domain/user/repository";
import type {
    PasswordHasherContract,
    TokenSignerContract,
    TokenVerifierContract,
    UserServiceContract,
} from "./user.types";

export function createUserService(
    repository: UserRepositoryContract,
    passwordHasher: PasswordHasherContract,
    tokenSigner: TokenSignerContract,
    tokenVerifier: TokenVerifierContract,
): UserServiceContract {
    return {
        async register(email, password) {
            const hashPassword = await passwordHasher.hashPassword(password);

            const user = await repository.createUser(
                email.trim(),
                hashPassword,
            );

            return {
                id: user.id,
                email: user.email,
            };
        },

        async login(email, password) {
            const user = await repository.getUserByEmail(email.trim());

            if (
                !user ||
                !(await passwordHasher.verifyPassword(user.password, password))
            ) {
                throw new InvalidCredentialsError("INVALID CREDENTIALS");
            }

            return {
                user: {
                    id: user.id,
                    email: user.email,
                },
                accessToken: tokenSigner.signAccessToken(user.id),
                refreshToken: tokenSigner.signRefreshToken(user.id),
            };
        },

        async refresh(refreshToken) {
            const userId = tokenVerifier.verifyRefreshToken(refreshToken);
            const user = await repository.getUserById(userId);

            return {
                accessToken: tokenSigner.signAccessToken(user.id),
                refreshToken: tokenSigner.signRefreshToken(user.id),
            };
        },

        async me(id) {
            const user = await repository.getUserById(id);

            return {
                id: user.id,
                email: user.email,
            };
        },
    };
}
