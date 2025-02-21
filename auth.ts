import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "./lib/api/axios";
import { AxiosErrorResponse } from "./types/AxiosErrorResponse";
import { getErrorMessage } from "./utils/getErrorMessage";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        password: { label: "Password", type: "password" },
        token: { label: "Verification Token", type: "text" },
      },

      async authorize(credentials) {

        try {
          const res = await api.post(
            "/ldapauth/dash/pinops/passwordLogin",
            { password: credentials?.password },
            {
              headers: {
                "Content-Type": "application/json",
                sourceapp: "ldapportal",
                otpfor: "login",
                Authorization: `Bearer ${credentials.token}`,
              },
            }
          );


          if (res.data) {
            const user = res.data.user;
            const token = res.data.token;


            return {
              id: user.userId,
              userName: user.userName,
              fullname: user.fullname,
              roleId: user.roleId,
              role: user.role,
              phoneNumber: user.phoneNumber,
              branchcode: user.branchcode,
              homeBranch: user.homeBranch,
              branchName: user.branchName,
              token: token,
            };
          }
        } catch (error: any) {
          const errorMessage =
            getErrorMessage({ message: error as AxiosErrorResponse }) ??
            "Login failed. Please try again.";
          toast.error(`Error: Incorrect PIN.`);
          throw new Error(
            error?.response?.data?.message ?? "Incorrect email or password"
          );
        }

        return null;
      },
    }),
  ],
  callbacks: {
    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;

      if (pathname.startsWith("/auth/signin") && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }
      return !!auth;
    },
    jwt({ token, user, trigger, session }) {
          if (user) {
        token.id = user.id ?? ""; 
        token.userName = user.userName;
        token.fullname = user.fullname;
        token.roleId = user.roleId;
        token.role = user.role;
        token.phoneNumber = user.phoneNumber;
        token.branchcode = user.branchcode;
        
        token.homeBranch = user.homeBranch;
        token.branchName = user.branchName;
        token.token = user.token;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      return token;
    },
    session({ session, token }) {
    

      session.user = {
        id: token.id,
        userName: token.userName,
        fullname: token.fullname,
        roleId: token.roleId,
        role: token.role,
        phoneNumber: token.phoneNumber,
        branchcode: token.branchcode,
        homeBranch: token.homeBranch,
        branchName: token.branchName,
        token: token.token,
        email: token.email || "",
        emailVerified:
          token.emailVerified && typeof token.emailVerified === "string"
            ? new Date(token.emailVerified)
            : null,
      };
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
});