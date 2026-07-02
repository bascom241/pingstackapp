import { create } from "zustand"

type LoginFormType = {
  email: string
  password: string
}

type AuthStore = {
  formData: LoginFormType
  token: string | null
  isAuthenticated: boolean

  setFormData: (data: Partial<LoginFormType>) => void
  setToken: (token: string) => void
  logout: () => void
  resetForm: () => void
}

export const useLoginStore = create<AuthStore>((set) => ({
  formData: {
    email: "",
    password: "",
  },

  token: null,
  isAuthenticated: false,

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setToken: (token) =>
    set({
      token,
      isAuthenticated: true,
    }),

  logout: () =>
    set({
      token: null,
      isAuthenticated: false,
    }),

  resetForm: () =>
    set({
      formData: { email: "", password: "" },
    }),
}))