import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import _contractJson from "./contract.json" with { type: "json" };
import type { Contract } from "./contract.d";

const contractJson = _contractJson as unknown as Contract;

export const db = postgres<Contract>({
    contract: contractJson,
    url: process.env["DATABASE_URL"]!,
});