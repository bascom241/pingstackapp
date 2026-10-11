"use client"

import React, { useState } from 'react'
import { ArrowRight, Loader2, EyeIcon, EyeClosed } from 'lucide-react'
import Input from "../../ui/Input"
import Logo from "../../assets/Logo.png"
import { useLogin } from '../../features/auth/hooks/useAuth'
import { useLoginStore } from '../../features/auth/store/useLoginStore'
import { useSnackbar } from 'notistack'
import { saveAuthSession } from '../../../utils/authToken'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getApiErrorMessage } from '../../utils/apiError'
import AuthSideSection from '../../ui/modals/AuthSideSection'

const Login: React.FC = () => {

    const { mutate, isError, isPending } = useLogin()
    const { formData, setFormData, setToken, resetForm } = useLoginStore()
    const { enqueueSnackbar } = useSnackbar()
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // State for password visibility toggle
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ [name]: value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate(formData, {
            onSuccess: (data) => {
                console.log(data)
                const token = data?.accessToken;
                const refreshToken = data?.refreshToken;

                const role = data?.roles?.[0];

                if (token) {
                    setToken(token);
                    saveAuthSession({ accessToken: token, refreshToken, role });
                }
                enqueueSnackbar(data?.message || "Login successful!", { variant: "success" });
                navigate(searchParams.get("redirect") || "/dashboard")
                resetForm()
            }, onError: (error: unknown) => {
                console.error("Registration error:", error);
                const errorMessage = getApiErrorMessage(error, "Something went wrong");
                enqueueSnackbar(errorMessage || "Login failed!", {
                    variant: "error"
                })
            }
        })
    }

    return (
        /* The container forces a clean full-height layout, splitting 50/50 via grid on large viewports */
        <main className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white transition-colors duration-200">

            {/* LEFT ROW LAYER: Deep Technical Telemetry Panel (Hidden on Mobile) */}
            <AuthSideSection variant='login'/>

            {/* RIGHT ROW LAYER: Minimalist, Spaced Forms Controller Canvas */}
            <section className="w-full flex flex-col justify-center px-6 py-12 sm:px-16 lg:px-24 bg-white transition-colors duration-200">
                <div className='flex flex-col gap-2 items-center justify-center'>
                    <img
                        src={Logo}
                        className='w-15 h-15 rounded-full items-center'
                    />
                    <p className='text-[#004aad] font-bold'>PINGSTACK</p>
                </div>

                {/* Form Wrapper Box */}
                <div className="w-full max-w-md mx-auto flex flex-col gap-8">

                    {/* Header Messaging Node */}
                    <div className="flex flex-col gap-2">
                        <h1 className="font-black text-3xl text-gray-900 dark:text-white tracking-tight">
                            Welcome to Pingstart
                        </h1>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Enter your verified company credential matrix to gain entry.
                        </p>
                    </div>

                    {/* Content Entry Form Controls */}
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                        <div className="w-full flex flex-col gap-6">
                            <Input
                                label="Company Email Address"
                                type="email"
                                placeholder="name@yourcompany.com"
                                className="w-full"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />

                            <div className="w-full flex flex-col gap-2">
                                {/* Isolated label to ensure the relative wrapper aligns directly with the input box */}
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Account Security Password
                                </label>
                                
                                <div className="relative w-full flex items-center">
                                    <Input
                                        // Omitted internal label prop from custom Input to manage positioning cleanly
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••••••"
                                        className="w-full pr-10"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    {/* Properly centered eye toggle icon button */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-3 inset-y-0 my-auto h-fit text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none cursor-pointer"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeClosed className="w-5 h-5" />
                                        ) : (
                                            <EyeIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>

                                <div className="flex justify-end">
                                    <a href="#" className="text-xs font-mono font-bold text-[#004aad] dark:text-blue-400 hover:underline">
                                        Forgot Matrix Password?
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Execution Trigger */}
                        <button
                            type="submit"
                            className="w-full mt-2 bg-[#004aad] hover:bg-blue-700 text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-sm shadow-blue-900/10 flex items-center justify-center gap-2 group cursor-pointer"
                        >
                            {
                                isPending ? <Loader2 className='animate-spin' /> : <> <span>Authenticate Credentials</span>  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
                            }
                        </button>
                    </form>

                    {/* Bottom Utility Footnote Layout Link */}
                    <div className="flex flex-col gap-2 text-center text-xs font-medium text-gray-400 dark:text-gray-500">
                        <p>
                            Forgot your password?{' '}
                            <a href="/forgot-password" className="text-[#004aad] dark:text-blue-400 font-bold hover:underline">
                                Reset it here
                            </a>
                        </p>
                        <p>
                            Don&apos;t have an account?{' '}
                            <a href="/register" className="text-[#004aad] dark:text-blue-400 font-bold hover:underline">
                                Sign up here
                            </a>
                        </p>
                    </div>

                </div>
            </section>

        </main>
    )
}

export default Login