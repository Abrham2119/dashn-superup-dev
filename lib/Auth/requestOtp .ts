import { Endpoints } from "@/constants/endpoints";
import api from "../api/axios";

export const requestOtp = async ({ username }: { username: string }) => {
    const res = await api.post(Endpoints.REQUEST_OTP, {
        username,
    },
        {
            headers: {
                sourceapp: "ldapportal",
                otpfor: "login",
            }
        }
    );

    return res.data;
};