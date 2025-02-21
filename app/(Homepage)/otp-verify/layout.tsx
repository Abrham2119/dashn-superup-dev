"use client";
import useLocalStorage from "@/hooks/useLocalStorage";
import { requestOtp } from "@/lib/Auth/requestOtp ";
import { AxiosErrorResponse } from "@/types/AxiosErrorResponse";
import { RequestOtpDataResponse } from "@/types/RequestOtpDataResponse ";
import { validationSchema } from "@/validation/requestOtpValidationSchema";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [otpToken, setOtpToken] = useLocalStorage<string | null>("otpToken", null);
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(100);

    const { mutate, isPending } = useMutation<RequestOtpDataResponse, AxiosErrorResponse, { username: string }>({
        mutationFn: ({ username }) => requestOtp({ username }),
        onSuccess: (response) => {
            toast.success(`OTP sent successfully! Your OTP is: ${response.otpcode}`, {
                autoClose: 20000,
            });
            setOtpToken(response.accesstoken);
            setCountdown(100);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
            setIsLoading(false);
        },
    });

    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [countdown]);


    const formik = useFormik({
        initialValues: {
            username: '',
        },
        validationSchema,
        onSubmit: (values, { setSubmitting }) => {
            mutate({ username: values.username });
            setSubmitting(false);
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
            <div className="w-full md:w-1/2 flex gap-4 text-center pb-36 md:pb-0 h-screen md:h-auto  md:pt-0 items-center justify-center flex-col bg-transparent p-4">
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
                    <h1 className="text-sm "> Welcome to Dashen Bank Dashboard!</h1>
                </div>
                <div className=" p-6 md:p-8 rounded-lg  w-full max-w-md">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="relative">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Enter username"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.username}
                                className="w-full h-full p-2 text-start py-3 border border-gray-300  rounded-md focus:outline-none focus:ring-2 focus:ring-dashenBlue text-sm md:text-base"
                            />
                            <button
                                type="submit"
                                disabled={formik.isSubmitting || isPending || countdown > 0}
                                className={` w-24 max-h-9 px-3  top-1 right-1 rounded-md text-white text-xs md:text-sm absolute ${formik.isSubmitting || isPending || isLoading || countdown > 0 ? 'bg-gray-400   cursor-not-allowed' : 'bg-dashenBlue hover:bg-blue-950 '}`}>
                                {formik.isSubmitting || isPending || isLoading ? (
                                    <div className=" flex justify-center  py-3">
                                        <FaSpinner className="animate-spin flex justify-center " />
                                    </div>
                                ) : countdown > 0 ? (
                                    <div className="  py-1 text-xs h-full">
                                        {`Get OTP after ${countdown}s`}
                                    </div>
                                ) : (
                                    <div className=" py-2">
                                        Get OTP
                                    </div>
                                )}
                            </button>
                        </div>
                        {formik.touched.username && formik.errors.username ? (
                            <div className="text-red-500 mt-1 text-xs text-start">{formik.errors.username}</div>
                        ) : (<div className=" text-transparent mt-1 text-xs text-start">Spacing</div>)}


                    </form>
                    {children}
                </div>
            </div>
        </div>
    );
}
