import { InvalidCredentialsError } from "../../domain/shared/errors";
import type { SessionRepositoryContract, UserRepositoryContract } from "../../domain/user/repository";
import type {
    PasswordHasherContract,
    RefreshTokenHasherContract,
    TokenSignerContract,
    TokenVerifierContract,
    UserServiceContract,
} from "./user.types";

export function createUserService(
    userRepository: UserRepositoryContract,
    sessionRepository: SessionRepositoryContract,
    passwordHasher: PasswordHasherContract,
    tokenSigner: TokenSignerContract,
    tokenVerifier: TokenVerifierContract,
    refreshTokenHasher: RefreshTokenHasherContract
): UserServiceContract {
    return {
        async register(email, password) {
            const hashPassword = await passwordHasher.hashPassword(password);

            const user = await userRepository.createUser(
                email.trim(),
                hashPassword,
            );

            return {
                id: user.id,
                email: user.email,
            };
        },

        async login(email, password) {
            const user = await userRepository.getUserByEmail(email.trim());

            if (
                !user ||
                !(await passwordHasher.verifyPassword(user.password, password))
            ) {
                throw new InvalidCredentialsError("INVALID CREDENTIALS");
            }

            const refreshToken = tokenSigner.signRefreshToken(user.id);

            await sessionRepository.create(
                refreshTokenHasher.hashRefreshToken(refreshToken),
                user.id,
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            )

            return {
                user: {
                    id: user.id,
                    email: user.email,
                },
                accessToken: tokenSigner.signAccessToken(user.id),
                refreshToken: refreshToken,
            };
        },

        async refresh(refreshToken) {
            const userId = tokenVerifier.verifyRefreshToken(refreshToken);
            const user = await userRepository.getUserById(userId);

            const newRefreshToken = tokenSigner.signRefreshToken(user.id);

            await sessionRepository.update(
                refreshTokenHasher.hashRefreshToken(refreshToken),
                refreshTokenHasher.hashRefreshToken(newRefreshToken),
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            );

            return {
                accessToken: tokenSigner.signAccessToken(user.id),
                refreshToken: newRefreshToken,
            };
        },

        async me(id) {
            const user = await userRepository.getUserById(id);

            return {
                id: user.id,
                email: user.email,
            };
        },

        async logout(refreshToken) {
            await sessionRepository.delete(
                refreshTokenHasher.hashRefreshToken(refreshToken)
            );
        },
    };
}
