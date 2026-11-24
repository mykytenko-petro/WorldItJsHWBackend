import "dotenv/config";
import argon2 from "argon2";
import type { PasswordHasherContract } from "../services/user/user.types";

export function createPasswordHasher(pepper: Buffer): PasswordHasherContract {
	return {
		hashPassword(password: string): Promise<string> {
			return argon2.hash(password, {
				type: argon2.argon2id,
				memoryCost: 19456,
				timeCost: 2,
				parallelism: 1,
				secret: pepper,
			});
		},

		verifyPassword(
			hash: string,
			password: string,
		): Promise<boolean> {
			return argon2.verify(hash, password, { secret: pepper });
		}
	};
}