import { number, object, string, type InferType } from "yup";
import { validate } from "../../shared/dto/validation";

const INVALID_CATEGORY_MESSAGE =
    "Query parameter 'category' must be a non-empty string.";
const INVALID_TAKE_TYPE_MESSAGE =
    "Query parameter 'take' must be a valid number or string.";
const INVALID_TAKE_VALUE_MESSAGE =
    "Query parameter 'take' must be a positive integer and not bigger than 2.";
const INVALID_ID_MESSAGE = "Route parameter 'id' must be a positive integer.";
const INVALID_POST_BODY_MESSAGE =
    "Invalid payload. 'title' and 'content' are required non-empty strings, and 'authorId' and 'categoryId' must be positive integers.";

const getPostsQuerySchema = object({
    category: string()
        .transform((value, originalValue) =>
            typeof originalValue === "string" ? value.trim() : value,
        )
        .typeError(INVALID_CATEGORY_MESSAGE)
        .test("string-query", INVALID_CATEGORY_MESSAGE, function () {
            return (
                this.originalValue === undefined ||
                this.originalValue === null ||
                typeof this.originalValue === "string"
            );
        })
        .min(1, INVALID_CATEGORY_MESSAGE)
        .optional(),
    take: number()
        .transform((value, originalValue) => (originalValue === "" ? 0 : value))
        .typeError(INVALID_TAKE_TYPE_MESSAGE)
        .integer(INVALID_TAKE_VALUE_MESSAGE)
        .moreThan(0, INVALID_TAKE_VALUE_MESSAGE)
        .max(2, INVALID_TAKE_VALUE_MESSAGE)
        .optional(),
});

const getPostByIdParamsSchema = object({
    id: number()
        .typeError(INVALID_ID_MESSAGE)
        .integer(INVALID_ID_MESSAGE)
        .moreThan(0, INVALID_ID_MESSAGE)
        .required(INVALID_ID_MESSAGE),
});

const requiredPostText = () =>
    string()
        .transform((value, originalValue) =>
            typeof originalValue === "string" ? value.trim() : value,
        )
        .typeError(INVALID_POST_BODY_MESSAGE)
        .test("string-body", INVALID_POST_BODY_MESSAGE, function () {
            return typeof this.originalValue === "string";
        })
        .min(1, INVALID_POST_BODY_MESSAGE)
        .required(INVALID_POST_BODY_MESSAGE);

const createPostBodySchema = object({
    title: requiredPostText(),
    content: requiredPostText(),
    authorId: number()
        .strict()
        .typeError(INVALID_POST_BODY_MESSAGE)
        .integer(INVALID_POST_BODY_MESSAGE)
        .moreThan(0, INVALID_POST_BODY_MESSAGE)
        .required(INVALID_POST_BODY_MESSAGE),
    categoryId: number()
        .strict()
        .typeError(INVALID_POST_BODY_MESSAGE)
        .integer(INVALID_POST_BODY_MESSAGE)
        .moreThan(0, INVALID_POST_BODY_MESSAGE)
        .required(INVALID_POST_BODY_MESSAGE),
})
    .typeError(INVALID_POST_BODY_MESSAGE)
    .required(INVALID_POST_BODY_MESSAGE);

export function validateGetPostsQuery(
    query: unknown,
): Promise<InferType<typeof getPostsQuerySchema>> {
    return validate(getPostsQuerySchema, query);
}

export function validateGetPostByIdParams(
    params: unknown,
): Promise<InferType<typeof getPostByIdParamsSchema>> {
    return validate(getPostByIdParamsSchema, params);
}

export function validateCreatePostBody(
    body: unknown,
): Promise<InferType<typeof createPostBodySchema>> {
    return validate(createPostBodySchema, body);
}
