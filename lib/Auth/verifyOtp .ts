import api from "../api/axios";

export const verifyOtp = async ({
    otpToken,
    otpcode,
}: {
    otpToken: string|null
    otpcode: number;
}) => {
    const res = await api.post("/ldapotp/dash/confirm/dashops", {
        otpcode,
    },
        {
            headers: {
                sourceapp: "ldapportal",
                otpfor: "login",
                Authorization: `Bearer ${otpToken}`
            }
        }
    );

    return res.data;
};