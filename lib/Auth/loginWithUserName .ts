import api from "../api/axios";

export const loginWithUserName = async ({
  verifyToken,
  password,
}: {
  verifyToken: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", {
    verifyToken,
    password,
  });

  return res.data;
};