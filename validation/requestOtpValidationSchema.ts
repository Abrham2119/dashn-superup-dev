import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
        username: Yup.string()
            .required("Username is Required")
            .min(3, "Username must be at least 3 characters")
            .max(20, "Username must be at most 20 characters")
            .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    });