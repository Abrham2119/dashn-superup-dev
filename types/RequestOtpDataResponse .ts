export interface RequestOtpDataResponse {
  status: boolean;
  expireson: string;
  senton: string;
  otpcode: string;
  accesstoken: string;
}