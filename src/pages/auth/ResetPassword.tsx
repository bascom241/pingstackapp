import React, { useState } from "react";
import Logo from "../../assets/Logo.png";
import Input from "../../ui/Input";
import { useResetPassword } from "../../features/auth/hooks/useAuth";
import { useSnackbar } from "notistack";
import { Loader2, EyeIcon, EyeClosed } from "lucide-react";
import { getApiErrorMessage } from "../../utils/apiError";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const { mutate, isPending } = useResetPassword();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        token: "",
        newPassword: "",
    });

    // State for password visibility toggle
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!formData.token.trim() || !formData.newPassword) {
            enqueueSnackbar("Please fill in all fields", {
                variant: "warning",
            });
            return;
        }

        mutate(
            {
                token: formData.token.trim(),
                newPassword: formData.newPassword,
            },
            {
                onSuccess: () => {
                    enqueueSnackbar(
                        "Password reset successfully",
                        {
                            variant: "success",
                        }
                    );
                    navigate("/login");
                },
                onError: (error: unknown) => {
                    console.error("Password reset error:", error);

                    const errorMessage = getApiErrorMessage(
                        error,
                        "Failed to reset password"
                    );

                    enqueueSnackbar(errorMessage, {
                        variant: "error",
                    });
                },
            }
        );
    };

    return (
        <main className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-5 py-12">

            <section className="w-full max-w-md">

                {/* Pingstack Branding */}
                <div className="flex flex-col items-center gap-2 mb-8">
                    <img
                        src={Logo}
                        alt="Pingstack logo"
                        className="w-16 h-16 rounded-full object-contain"
                    />

                    <p className="text-[#004aad] font-bold tracking-wide">
                        PINGSTACK
                    </p>
                </div>

                {/* Reset Password Card */}
                <div className="w-full bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">

                    {/* Header */}
                    <div className="flex flex-col gap-2 mb-8">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                            Reset your password
                        </h1>

                        <p className="text-sm text-gray-500 leading-6">
                            Enter the reset token you received and
                            choose a new password for your Pingstack
                            account.
                        </p>
                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="w-full flex flex-col gap-5"
                    >
                        {/* Reset Token */}
                        <Input
                            label="Reset Token"
                            name="token"
                            type="text"
                            placeholder="Enter your reset token"
                            className="w-full"
                            value={formData.token}
                            onChange={handleChange}
                        />

                        {/* New Password with Eye Icon Toggle */}
                        <div className="w-full flex flex-col gap-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                New Password
                            </label>

                            <div className="relative w-full flex items-center">
                                <Input
                                    name="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your new password"
                                    className="w-full pr-10"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                />
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
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full mt-2 bg-[#004aad] hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 px-4 rounded-xl transition-all shadow-sm shadow-blue-900/10 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Resetting password...</span>
                                </>
                            ) : (
                                <span>Reset Password</span>
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="text-center text-sm text-gray-500 mt-7">
                        Changed your mind?{" "}
                        <a
                            href="/login"
                            className="text-[#004aad] font-bold hover:underline"
                        >
                            Sign in here
                        </a>
                    </p>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    Secure password recovery by Pingstack
                </p>

            </section>
        </main>
    );
};

export default ResetPassword;