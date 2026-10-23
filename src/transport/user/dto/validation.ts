import { object, string, type InferType } from "yup";
import { validate } from "../../shared/dto/validation";

const INVALID_CREDENTIALS_MESSAGE = "Email and password are required.";
const INVALID_EMAIL_MESSAGE = "Email must be a valid email address.";

const credentialsBodySchema = object({
    email: string()
        .transform((value, originalValue) =>
            typeof originalValue === "string" ? value.trim() : value,
        )
        .typeError(INVALID_CREDENTIALS_MESSAGE)
        .email(INVALID_EMAIL_MESSAGE)
        .required(INVALID_CREDENTIALS_MESSAGE),
    password: string()
        .typeError(INVALID_CREDENTIALS_MESSAGE)
        .required(INVALID_CREDENTIALS_MESSAGE),
})
    .typeError(INVALID_CREDENTIALS_MESSAGE)
    .required(INVALID_CREDENTIALS_MESSAGE);

type UserCredentials = InferType<typeof credentialsBodySchema>;

export function validateRegisterBody(body: unknown): Promise<UserCredentials> {
    return validate(credentialsBodySchema, body);
}

export function validateLoginBody(body: unknown): Promise<UserCredentials> {
    return validate(credentialsBodySchema, body);
}
