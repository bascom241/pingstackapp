import { create } from "zustand";

type RegisterFormType = {
  firstName: "";
  email: "";
  password: "";
  lastName: "";
  phoneNumber: "";
  companyName: "";
  sector: "";
  creatorRole: "";
  source: "";
    countryCode: string;
};

type AuthStore = {
  formData: RegisterFormType;
  setFormData: (data: Partial<RegisterFormType>) => void;
  resetForm: () => void;
};

export const useRegisterStore = create<AuthStore>((set) => ({
  formData: {
    firstName: "",
    email: "",
    password: "",
    lastName: "",
    phoneNumber: "",
    companyName: "",
    sector: "",
    creatorRole: "",
    source: "",
      countryCode: ""
  },

  token: null,
  isAuthenticated: false,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),



 

  resetForm: () =>
    set({
      formData: {
        firstName: "",
        email: "",
        password: "",
        lastName: "",
        phoneNumber: "",
        companyName: "",
        sector: "",
        creatorRole: "",
        source: "",
          countryCode: ""
      },
    }),
}));
