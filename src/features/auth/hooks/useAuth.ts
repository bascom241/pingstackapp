import { useMutation } from "@tanstack/react-query";
import { login, register , forgotPasword, resetPassword} from "../api/auth";


export const useLogin = () => {
    return useMutation({
        mutationFn: login
    })
}

export const useRegister = () => {
    return useMutation({
        mutationFn: register
    })
}

export const useForgotPasword = () => {
    return useMutation({
        mutationFn: forgotPasword
    })
}

export const useResetPassword = () => {
    return useMutation({
        mutationFn:resetPassword
    })
}