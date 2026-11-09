import type { ApiUserType } from "@/config/auth";

export type PortalLoginPayload = {
  User_Type: ApiUserType;
  Login_Id: string;
  Password: string;
};

export type PatientSignupPayload = {
  Full_Name: string;
  Email_Id: string;
  Password: string;
};

/** Shared by sign-in and sign-up; `user_Cd` is Agent_Cd / Member_Id. The token never reaches the browser. */
export type PortalUser = {
  user_Type: ApiUserType;
  user_Cd: string;
  user_Full_Name: string;
  email_Id: string;
  calling_Cd: string;
  mobile_No: string;
};
