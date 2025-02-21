"use client";
import { handleCredentialsSignin } from "@/app/actions/authActions";
import { Endpoints } from "@/constants/endpoints";
import useLocalStorage from "@/hooks/useLocalStorage";
import { AxiosErrorResponse } from "@/types/AxiosErrorResponse";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { validationSchema } from "@/validation/loginValidationSchema ";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [verifyToken] = useLocalStorage<string | null>("verifyToken", null);
  const [otpToken] = useLocalStorage<string | null>("otpToken", null);
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    if (!otpToken || !verifyToken) {
      router.push(Endpoints.AUTH_REDIRECT_PATH);
    }
  }, [otpToken, router, verifyToken]);

  const formik = useFormik({
    initialValues: {
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      if (!verifyToken) {
        toast.error("Verification token not found.");
        setLoading(false);
        setSubmitting(false);
        return;
      }
      try {
        const result = await handleCredentialsSignin({ password: values.password, verifyToken });

        if (result?.message) {
          const errorMessage = getErrorMessage({ message: result.message as unknown as AxiosErrorResponse })
            || "Login failed. Please try again.";
          toast.error(`Login failed: ${errorMessage}`);
        } else if (!result?.message) {
          toast.success("Login successful!");
          router.push("/dashboard/checker");
        }
      } catch (error) {
        const errorMessage = getErrorMessage({ message: error as unknown as AxiosErrorResponse })
          || "An unexpected error occurred.";
        toast.error(`Error: ${errorMessage}`);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-dashenBlue items-center justify-center text-white">
        <div className="flex flex-col gap-2 text-center px-4">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Welcome to</h1>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Dashen Super App Dashboard</h1>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex gap-4 text-center pb-36 md:pb-0 h-screen md:h-auto md:pt-0 items-center justify-center flex-col bg-transparent p-4">
        <div className="">
          <Image
            src="/Dashen-Bank-Logo.png"
            alt="Dashen Super App"
            width={300}
            height={200}
            className="rounded-lg shadow-lg mb-4 w-auto h-auto"
          />
        </div>
        <div className="flex flex-col gap-1 text-center px-4">
          <h1 className="text-sm sm:text-base md:text-2xl font-bold">Login</h1>
          <h1 className="text-sm">Welcome to Dashen Bank Dashboard!</h1>
        </div>
        <div className="p-6 md:p-8 rounded-lg w-full max-w-md">
          <form onSubmit={formik.handleSubmit}>
            <label className="block text-sm w-full text-gray-700 py-1 text-left">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                className="w-full h-full p-2 text-start py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-dashenBlue text-sm md:text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 mt-1 text-xs text-start">{formik.errors.password}</div>
            ) : (
              <div className="text-transparent mt-1 text-xs text-start">Spacing</div>
            )}
            <button
              type="submit"
              disabled={formik.isSubmitting || loading}
              className={`w-full mt-4 py-2 rounded-md text-white text-sm md:text-base ${formik.isSubmitting || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-dashenBlue hover:bg-blue-950'
                }`}
            >
              {formik.isSubmitting || loading ? (
                <div className="flex justify-center py-1">
                  <FaSpinner className="animate-spin" />
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}