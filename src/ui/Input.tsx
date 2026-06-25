"use client"

import * as React from "react"
import TextField from "@mui/material/TextField"

type InputProps = {
    label?: string
    type?: string
    placeholder?: string
    value?: string
    name?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string // Added to catch custom styles passed down from parent components
}

export default function Input({ label, type = "text",name,  value, onChange, placeholder, className }: InputProps) {
    return (
        <TextField
            label={label}
            name={name}
            type={type}
            fullWidth
            variant="outlined"
            value={value}
            onChange={onChange}  
            className={className}
            slotProps={{
                input: {
                    placeholder: placeholder,
                },
            }}

            sx={{
                // Target the label text colors natively in light and dark modes
                "& .MuiInputLabel-root": {
                    color: "#9ca3af", // Tailwind text-gray-400
                    fontSize: "0.875rem",
                    fontFamily: "inherit",
                    "&.Mui-focused": {
                        color: "#004aad", // Your brand color on focus
                    },
                },

                "& .MuiOutlinedInput-root": {
                    borderRadius: "12px", // Smooth rounded layout border matching reference 3
                    backgroundColor: "#f8fafc", // Crisp light gray input canvas box
                    fontFamily: "inherit",
                    fontSize: "0.875rem",
                    transition: "all 0.2s ease-in-out",

                    // Handle full-box clean borders rather than raw under-lines
                    "& fieldset": {
                        border: "1px solid #e2e8f0", // Tailwind border-gray-200
                        transition: "all 0.15s ease",
                    },

                    "&:hover fieldset": {
                        borderColor: "#cbd5e1", // Tailwind border-gray-300
                    },

                    "&.Mui-focused fieldset": {
                        borderColor: "#004aad", // Focus ring matches your brand blue perfectly
                        borderWidth: "1.5px",
                    },
                },

                // Style the inner native string input field properties
                "& .MuiOutlinedInput-input": {
                    padding: "14px 16px",
                    color: "#1f2937", // Tailwind text-gray-800
                    caretColor: "#004aad",
                    "&::placeholder": {
                        color: "#9ca3af",
                        opacity: 1, // Fixes default browser text opacity bugs
                    },
                },
            }}
        />
    )
}