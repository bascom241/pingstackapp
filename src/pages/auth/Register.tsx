"use client"

import React from 'react'
import { ArrowRight } from 'lucide-react'
import Input from "../../ui/Input"

import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { useRegisterStore } from '../../features/auth/store/useRegisterStore'
import { useRegister } from '../../features/auth/hooks/useAuth'
import { useSnackbar } from 'notistack'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getApiErrorMessage } from '../../utils/apiError'
import { Loader2 } from 'lucide-react'

const Register: React.FC = () => {
    const { formData, setFormData } = useRegisterStore();
    const { mutate, isPending } = useRegister();
    const { enqueueSnackbar } = useSnackbar();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const payload = {
            ...formData,
            phoneNumber:
                formData.countryCode +
                formData.phoneNumber.replace(/^0+/, ""),
        } as any;
        mutate(payload, {
            onSuccess: (data) => {

                enqueueSnackbar(data?.message || "Login successful!", {
                    variant: "success"
                })
                navigate(searchParams.get("redirect") || "/login")
            }, onError: (err) => {
                console.log(err)
                const errorMessage = getApiErrorMessage(err, "Something went wrong");
                enqueueSnackbar(errorMessage || "Registeriom failed!", {
                    variant: "error"
                })
            }
        })
    }
    return (
        <main className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white overflow-hidden">

            {/* LEFT ROW LAYER: Telemetry Side Panel */}
            <section className="hidden lg:flex flex-col justify-between p-12 bg-[#004aad] relative overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(white 1.5px, transparent 1.5px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                <div className="relative z-10 flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-200 tracking-widest uppercase">
                        // INITIALIZE PROVISIONING SEQUENCE
                    </span>
                </div>

                <div className="relative z-10 flex flex-col gap-3 max-w-md my-auto">
                    <h2 className="text-3xl font-black text-white tracking-tight leading-tight">
                        Build on live channels. <br />
                        <span className="text-blue-200 underline decoration-2 decoration-blue-300/40 underline-offset-4">Deploy instantly.</span>
                    </h2>
                    <p className="text-xs text-blue-100/80 leading-relaxed font-medium">
                        Provision your developer account to instantly generate sandbox API keys, register custom corporate alphanumeric sender IDs, and connect high-throughput routing triggers.
                    </p>
                </div>

                <div className="relative z-10 grid grid-cols-3 gap-4 border-t border-blue-400/30 pt-6 font-mono">
                    <div className="flex flex-col">
                        <span className="text-lg font-black text-white tracking-tight">&lt; 3s</span>
                        <span className="text-[9px] text-blue-200 font-bold uppercase tracking-wider mt-0.5">OTP Latency</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black text-white tracking-tight">004</span>
                        <span className="text-[9px] text-blue-200 font-bold uppercase tracking-wider mt-0.5">Telco Trunks</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-black text-white tracking-tight">₦0.00</span>
                        <span className="text-[9px] text-blue-200 font-bold uppercase tracking-wider mt-0.5">Test Credits</span>
                    </div>
                </div>
            </section>

            {/* RIGHT ROW LAYER: Compact Form Canvas */}
            <section className="w-full flex flex-col justify-center px-6 py-6 sm:px-12 lg:px-16 bg-white self-center">

                {/* Tightened core wrapper */}
                <div className="w-full max-w-xl mx-auto flex flex-col gap-5">

                    {/* Header */}
                    <div className="flex flex-col gap-0.5">
                        <h1 className="font-black text-2xl text-gray-900 tracking-tight">
                            Welcome to PINGSTACK
                        </h1>
                        <p className="text-xs font-medium text-gray-500">
                            Enter your details to create an account
                        </p>
                    </div>

                    {/* Registration Form with tighter vertical flow */}
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3.5">

                        {/* Row 1: Names */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <Input label="First Name" type="text" placeholder="John" name="firstName"
                                value={formData.firstName}
                                onChange={(e) =>
                                    setFormData({ firstName: e.target.value as any })
                                } />
                            <Input label="Last Name" type="text" placeholder="Doe" value={formData.lastName}
                                onChange={(e) =>
                                    setFormData({ lastName: e.target.value as any })
                                } />
                        </div>

                        {/* Row 2: Credentials */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <Input label="Work Email" type="email" placeholder="john@company.com" name='email' value={formData.email}
                                onChange={(e) =>
                                    setFormData({ email: e.target.value as any })
                                } />
                            <Input label="Password" type="password" placeholder="••••••••••••" value={formData.password}
                                onChange={(e) =>
                                    setFormData({ password: e.target.value as any })
                                } />
                        </div>

                        {/* Row 3: Phone Number Block */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-start">
                            <div className="sm:col-span-1">
                                <FormControl fullWidth sx={dropdownStyles}>
                                    <InputLabel id="dial-code-label">Country</InputLabel>
                                    <Select
                                        value={formData.countryCode}
                                        onChange={(e) =>
                                            setFormData({ countryCode: e.target.value })
                                        }
                                    >
                                        <MenuItem value="+234">🇳🇬 +234</MenuItem>
                                        <MenuItem value="+233">🇬🇭 +233</MenuItem>
                                        <MenuItem value="+254">🇰🇪 +254</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="sm:col-span-2">
                                <Input label="Phone Number" type="tel" placeholder="80 1234 5678" value={formData.phoneNumber}
                                    onChange={(e) =>
                                        setFormData({ phoneNumber: e.target.value as any })
                                    } />
                            </div>
                        </div>

                        {/* Row 4: Company Name */}
                        <div className="w-full">
                            <Input label="Company Name" type="text" placeholder="Acme Technologies Ltd" value={formData.companyName}
                                onChange={(e) =>
                                    setFormData({ companyName: e.target.value as any })
                                } />
                        </div>

                        {/* Row 5: Dropdowns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <FormControl fullWidth sx={dropdownStyles}>
                                <InputLabel id="sector-label">Select Sector</InputLabel>
                                <Select
                                    value={formData.sector}
                                    onChange={(e) =>
                                        setFormData({ sector: e.target.value as any })
                                    }
                                >
                                    <MenuItem value="Financial_Services">Financial Services</MenuItem>
                                    <MenuItem value="Online_Retail_Services">Online Retail Services</MenuItem>
                                    <MenuItem value="Educational_Services">Education Services</MenuItem>
                                    <MenuItem value="Advertising_And_Marketing_Services">
                                        Advertising & Marketing Services
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={dropdownStyles}>
                                <InputLabel id="role-label">Select Role</InputLabel>
                                <Select
                                    value={formData.creatorRole}
                                    onChange={(e) =>
                                        setFormData({ creatorRole: e.target.value as any })
                                    }
                                >
                                    <MenuItem value="Engineering_Lead_OR_CTO">
                                        Engineering Lead / CTO
                                    </MenuItem>

                                    <MenuItem value="ProductManager">
                                        Product Manager
                                    </MenuItem>

                                    <MenuItem value="OPERATION_AND_DEVOPS">
                                        Operations & DevOps
                                    </MenuItem>

                                    <MenuItem value="FOUNDER_OR_EXECUTIVE">
                                        Founder / Executive
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </div>

                        {/* Row 6: Attribution */}
                        <FormControl fullWidth sx={dropdownStyles}>
                            <InputLabel id="discovery-label">How did you hear about us?</InputLabel>
                            <Select
                                value={formData.source}
                                onChange={(e) =>
                                    setFormData({ source: e.target.value as any })
                                }
                            >
                                <MenuItem value="Google">Google</MenuItem>
                                <MenuItem value="Linkedin">LinkedIn</MenuItem>
                                <MenuItem value="Twitter">Twitter / X</MenuItem>
                                <MenuItem value="Communication">Referral / Word of mouth</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>

                        {/* Action Button */}
                        <button
                            type="submit"
                            className="w-full mt-2 bg-[#004aad] hover:bg-blue-700 text-white font-bold text-sm py-3 px-4 rounded-xl transition-all shadow-sm shadow-blue-900/10 flex items-center justify-center gap-2 group cursor-pointer"
                        >
                            {
                                isPending ? <Loader2 className='animate-spin' /> : <><span>Create my account</span> <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
                            }

                        </button>
                    </form>

                    {/* Footer Anchor */}
                    <p className="text-center text-xs font-medium text-gray-400 mt-1">
                        Already have an active infrastructure account?{' '}
                        <a href="/login" className="text-[#004aad] font-bold hover:underline">
                            Log In here
                        </a>
                    </p>

                </div>
            </section>

        </main>
    )
}

// Compact structural input dimensions configuration
const dropdownStyles = {
    "& .MuiInputLabel-root": {
        color: "#9ca3af",
        fontSize: "0.8rem",
        // Force the label to sit correctly whether empty or shrunk
        transform: "translate(14px, 12px) scale(1)",
        "&.MuiInputLabel-shrink": {
            // This forces it cleanly up into the top border line
            transform: "translate(14px, -6px) scale(0.75) !important",
            backgroundColor: "#ffffff", // Prevents the border line from cutting through text
            padding: "0 4px",
        },
        "&.Mui-focused": {
            color: "#004aad",
        },
    },
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        backgroundColor: "#f8fafc",
        fontSize: "0.825rem",
        "& fieldset": {
            borderColor: "#e2e8f0",
        },
        "&:hover fieldset": {
            borderColor: "#cbd5e1",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#004aad",
            borderWidth: "1.5px",
        },
    },
    "& .MuiSelect-select": {
        padding: "10px 14px",
        color: "#1f2937",
        display: "flex",
        alignItems: "center",
    },
}

export default Register