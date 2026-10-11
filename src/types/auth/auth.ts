export interface LoginType {
  email: string;
  password: string;
}

export interface RegisterType {
  firstName: "";
  email: "";
  password: "";
  lastName: "";
  phoneNumber: any;
  companyName: "";
  sector: "";
  creatorRole: "";
  source: "";
   countryCode: ""
}

export interface ForgotPassword {
  email: ""
}

export interface ResetPassword {
  token: string
  newPassword: string
}
