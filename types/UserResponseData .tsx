export interface User {
    userId: string;
    userName: string;
    fullname: string;
    roleId: string;
    phoneNumber: string;
    branchcode: string[];
    homeBranch: string;
    branchName: string;
    loginTime: number;
}

export interface UserResponseData {
    token: string;
    user: User;
}