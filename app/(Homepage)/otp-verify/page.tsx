"use client";
import { Endpoints } from "@/constants/endpoints";
import useLocalStorage from "@/hooks/useLocalStorage";
import { verifyOtp } from "@/lib/Auth/verifyOtp ";
import { AxiosErrorResponse } from "@/types/AxiosErrorResponse";
import { VerifyOtpDataResponse } from "@/types/VerifyOtpDataResponse ";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function VerifyOTP() {
  const [otpToken] = useLocalStorage<string | null>("otpToken", null);
  const [verifyToken, setVerifyToken] = useLocalStorage<string | null>("verifyToken", null);
  const router = useRouter();
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));

  useEffect(() => {
    if (!otpToken) {
      router.push(Endpoints.AUTH_REDIRECT_PATH);
    }
  }, [otpToken, router]);

  const { mutate, isPending } = useMutation<VerifyOtpDataResponse, AxiosErrorResponse, { otpcode: number; otpToken: string | null }>({
    mutationFn: ({ otpcode, otpToken }) => verifyOtp({ otpcode, otpToken }),

    onSuccess: (response) => {
      toast.success(`OTP verified successfully!`, {
        autoClose: 2000,
      });
      setVerifyToken(response.accesstoken);
      router.push("/login");
    },

    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to verify OTP. Please try again.",
      );
      setOtpDigits(Array(6).fill(""));
      formik.setFieldValue("otpcode", "");
    },
  });

  const formik = useFormik({
    initialValues: {
      otpcode: '',
    },
    onSubmit: (values, { setSubmitting }) => {
      const otpcodeNumber = Number(values.otpcode);
      mutate({ otpcode: otpcodeNumber, otpToken });
      setSubmitting(false);
    },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = value;
      setOtpDigits(newOtpDigits);

      const otpcode = newOtpDigits.join("");
      formik.setFieldValue("otpcode", otpcode);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-digit-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const isOtpComplete = otpDigits.every((digit) => digit !== "");

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex gap-2 pt-4 justify-between w-full">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              type="text"
              id={`otp-digit-${index}`}
              name={`otp-digit-${index}`}
              placeholder="0"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onBlur={formik.handleBlur}
              className="w-12 h-12 text-center border rounded"
            />
          ))}
        </div>

        {formik.touched.otpcode && formik.errors.otpcode ? (
          <div className="text-red-500 mt-1 text-xs text-start">{formik.errors.otpcode}</div>
        ) : (<div className=" text-transparent mt-1 text-xs  text-start">Spacing</div>)}

        <button
          type="submit"
          disabled={!isOtpComplete || formik.isSubmitting || isPending}
          className={` w-full mt-2  py-2 rounded ${!isOtpComplete || formik.isSubmitting || isPending
            ? "bg-gray-300 text-gray-500  cursor-not-allowed"
            : "bg-dashenBlue hover:bg-blue-950 text-white"
            }`}
        >
          {formik.isSubmitting || isPending ? <div className=" flex justify-center  py-3">
            <FaSpinner className="animate-spin flex justify-center " />
          </div> : "Next"}
        </button>
      </form>
    </div>
  );
}