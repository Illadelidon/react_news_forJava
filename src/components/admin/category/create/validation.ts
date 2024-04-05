import * as yup from "yup";

export const categoryCreateValidationSchema = yup.object({
    name: yup.string().min(3, "Мінімальна довжна має бути 3 символи").max(200, "Максимальна довжина 200 символів"),
    description: yup.string().min(3, "Мінімальна довжна має бути 3 символи").max(4000, "Максимальна довжина 4000 символів"),
});