import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is Required")
    .min(6, "Password must be at least 6 characters"),
});
