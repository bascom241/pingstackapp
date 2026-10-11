import React, { useState } from 'react'
import AuthSideSection from '../../ui/modals/AuthSideSection'
import Logo from "../../assets/Logo.png"
import Input from '../../ui/Input'
import { ArrowRight, Loader2, SendHorizontal  } from 'lucide-react'
import { useForgotPasword } from '../../features/auth/hooks/useAuth'
import type { ForgotPassword } from '../../types/auth/auth'
import { useSnackbar } from 'notistack'
import { getApiErrorMessage } from '../../utils/apiError'

const ForgotPasswordPage = () => {

    const [email, setEmail] = useState("");
    const { enqueueSnackbar } = useSnackbar()
    const { mutate, isPending, isError } = useForgotPasword()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({ email } as ForgotPassword, {
            onSuccess: () => {
                enqueueSnackbar("Message sent if the email exist", {
                    variant: "success"
                })
            }, onError: (error: unknown) => {
                console.error("Registration error:", error);
                const errorMessage = getApiErrorMessage(error, "Something went wrong");
                enqueueSnackbar(errorMessage || "Failed to Initialize message", {
                    variant: "error"
                })
            }
        })

    }

    return (

        <main className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white transition-colors duration-200">
            <AuthSideSection variant='forgot-password' />


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
                            Forgot Password?
                        </h1>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Enter your registered email address and we&apos;ll send you instructions to reset your password.
                        </p>
                    </div>

                    {/* Content Entry Form Controls */}
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
                        <div className="w-full flex flex-col gap-6">
                            <Input
                                label=" Email Address"
                                type="email"
                                placeholder="name@yourcompany.com"
                                className="w-full"
                                value={email}
                                onChange={handleChange}
                            />


                        </div>

                        {/* Interactive Execution Trigger */}
                        <button
                            type="submit"
                            className="w-full mt-2 bg-[#004aad] hover:bg-blue-700 text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-sm shadow-blue-900/10 flex items-center justify-center gap-2 group cursor-pointer"
                        >
                            {
                                isPending ? <Loader2 className='animate-spin' /> : <> <span>Send me an Email</span>  <SendHorizontal className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
                            }


                        </button>
                    </form>



                    <p className="text-center text-xs font-medium text-gray-400 dark:text-gray-500">
                        Remembered your password?{' '}
                        <a href="/login" className="text-[#004aad] dark:text-blue-400 font-bold hover:underline">
                            Sign in here
                        </a>
                    </p>

                </div>
            </section>
        </main>

    )
}

export default ForgotPasswordPage