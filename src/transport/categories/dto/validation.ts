import { number, object, string, type InferType } from "yup";
import { validate } from "../../shared/dto/validation";

const INVALID_ID_MESSAGE = "Route parameter 'id' must be a positive integer.";
const INVALID_CATEGORY_NAME_MESSAGE =
    "Category 'name' must be a non-empty string.";

const getCategoryByIdParamsSchema = object({
    id: number()
        .typeError(INVALID_ID_MESSAGE)
        .integer(INVALID_ID_MESSAGE)
        .moreThan(0, INVALID_ID_MESSAGE)
        .required(INVALID_ID_MESSAGE),
});

const createCategoryBodySchema = object({
    name: string()
        .transform((value, originalValue) =>
            typeof originalValue === "string" ? value.trim() : value,
        )
        .typeError(INVALID_CATEGORY_NAME_MESSAGE)
        .test("string-body", INVALID_CATEGORY_NAME_MESSAGE, function () {
            return typeof this.originalValue === "string";
        })
        .min(1, INVALID_CATEGORY_NAME_MESSAGE)
        .required(INVALID_CATEGORY_NAME_MESSAGE),
})
    .typeError(INVALID_CATEGORY_NAME_MESSAGE)
    .required(INVALID_CATEGORY_NAME_MESSAGE);

export function validateGetCategoryByIdParams(
    params: unknown,
): Promise<InferType<typeof getCategoryByIdParamsSchema>> {
    return validate(getCategoryByIdParamsSchema, params);
}

export function validateCreateCategoryBody(
    body: unknown,
): Promise<InferType<typeof createCategoryBodySchema>> {
    return validate(createCategoryBodySchema, body);
}
