"use client"

import React from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import Input from "../../ui/Input"
import Logo from "../../assets/Logo.png"
import { useLogin } from '../../features/auth/hooks/useAuth'
import { useLoginStore } from '../../features/store/useLoginStore'
import { useSnackbar } from 'notistack'
import { saveAuthSession } from '../../../utils/authToken'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getApiErrorMessage } from '../../utils/apiError'
const Login: React.FC = () => {

    const { mutate, isError, isPending } = useLogin()
    const { formData, setFormData, setToken, resetForm } = useLoginStore()
    const { enqueueSnackbar } = useSnackbar()
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
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

                // Fix 2: Access the roles array from the root and grab the first item (e.g., "ROLE_User")
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
            <section className="hidden lg:flex flex-col justify-between p-16 bg-[#004aad] relative overflow-hidden">

                {/* Subtle structural canvas pattern to match the engineering aesthetic */}
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(white 1.5px, transparent 1.5px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                {/* Top Corner: Brand Heading Indicator */}
                <div className="relative z-10 flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-200 tracking-widest uppercase">
                        // CORE INTERCONNECT NODE
                    </span>
                </div>

                {/* Middle Content: Intentional Value Proposition */}
                <div className="relative z-10 flex flex-col gap-4 max-w-md my-auto">
                    <h2 className="text-4xl font-black text-white tracking-tight leading-none">
                        Every execution. <br />
                        <span className="text-blue-200 underline decoration-2 decoration-blue-300/40 underline-offset-4">Signal guaranteed.</span>
                    </h2>
                    <p className="text-sm text-blue-100/80 leading-relaxed font-medium">
                        Log into your structural routing dashboard to manage live direct carrier lanes, audit transactional token payloads, and handle SME fallback scripts.
                    </p>
                </div>

                {/* Bottom Footer: Real Hard Telemetry Counters */}
                <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-blue-400/30 pt-8 font-mono">
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-white tracking-tight">500M+</span>
                        <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mt-0.5">Transactions</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-white tracking-tight">99.97%</span>
                        <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mt-0.5">Uptime SLA</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black text-white tracking-tight">4 Nodes</span>
                        <span className="text-[10px] text-blue-200 font-bold uppercase tracking-wider mt-0.5">Local Telcos</span>
                    </div>
                </div>
            </section>

            {/* RIGHT ROW LAYER: Minimalist, Spaced Forms Controller Canvas */}
            <section className="w-full flex flex-col justify-center px-6 py-12 sm:px-16 lg:px-24 bg-white  transition-colors duration-200">
                <div className='flex flex-col gap-2  items-center justify-center'>
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
                                <Input
                                    label="Account Security Password"
                                    type="password"
                                    placeholder="••••••••••••"
                                    className="w-full"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
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
                    <p className="text-center text-xs font-medium text-gray-400 dark:text-gray-500">
                        Don't have an infrastructure node account?{' '}
                        <a href="/register" className="text-[#004aad] dark:text-blue-400 font-bold hover:underline">
                            Provision a new account here
                        </a>
                    </p>

                </div>
            </section>

        </main>
    )
}

export default Login