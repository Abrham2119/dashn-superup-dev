import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
    interface User {
        id: userId; 
        userName: string;
        fullname: string;
        roleId: string;
        role: string;
        phoneNumber: string;
        branchcode: string;
        homeBranch: string;
        branchName: string;
        token: string;
    }

    interface Session {
        user: User;
        expires: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        userName: string;
        fullname: string;
        roleId: string;
        role: string;
        phoneNumber: string;
        branchcode: string;
        homeBranch: string;
        branchName: string;
        token: string;
    }
}