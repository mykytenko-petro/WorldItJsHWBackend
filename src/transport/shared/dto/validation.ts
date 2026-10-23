import type { Schema } from "yup";

export async function validate<T>(
    schema: Schema<T>,
    value: unknown,
): Promise<T> {
    return await schema.validate(value, { stripUnknown: true });
}
