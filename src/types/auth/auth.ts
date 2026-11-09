export interface LoginType {
  email: string;
  password: string;
}

export interface RegisterType {
  firstName: string;
  email: string;
  password: string;
  lastName: string;
  phoneNumber: string;
  companyName: string;
  sector: string;
  creatorRole: string;
  source: string;
  countryCode: string;
}

export interface ForgotPassword {
  email: string
}

export interface ResetPassword {
  token: string
  newPassword: string
}
