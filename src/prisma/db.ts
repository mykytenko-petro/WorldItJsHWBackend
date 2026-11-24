import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./contract.d";
import _contractJson from "./contract.json" with { type: "json" };

const contractJson = _contractJson as unknown as Contract;

export const db = postgres<Contract>({
    contract: contractJson,
    url: process.env.DATABASE_URL!,
});
