"use client";
import * as React from "react";
import MuiButton from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { ArrowRight } from "lucide-react";

type ButtonProps = {
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isPending?: boolean;
  disabled?: boolean;
  className?: string;
  showArrow?: boolean;
};

export default function Button({
  children = "Authenticate Credentials",
  type = "submit",
  onClick,
  isPending = false,
  disabled = false,
  className,
  showArrow = false,
}: ButtonProps) {
  return (
    <MuiButton
      type={type}
      onClick={onClick}
      disabled={disabled || isPending}
      fullWidth
      variant="contained"
      // 1. Pass className directly to the component
      className={className}
      endIcon={
        isPending ? null : showArrow ? (
          <ArrowRight className="w-4 h-4 transition-transform icon-arrow" />
        ) : null
      }
     
      
    >
      {isPending ? (
        <CircularProgress size={20} thickness={5} sx={{ color: "#ffffff" }} />
      ) : (
        children
      )}
    </MuiButton>
  );
}
