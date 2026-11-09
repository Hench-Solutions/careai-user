/** Wire values of the API's `User_Type`. */
export const API_USER_TYPES = {
  patient: "PATIENT",
  agent: "AGENT",
} as const;

export type ApiUserType = (typeof API_USER_TYPES)[keyof typeof API_USER_TYPES];

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

/** Shared by sign-in and sign-up; `user_Cd` is Agent_Cd / Member_Id. */
export type PortalUser = {
  user_Type: ApiUserType;
  user_Cd: string;
  user_Full_Name: string;
  email_Id: string;
  calling_Cd: string;
  mobile_No: string;
};
