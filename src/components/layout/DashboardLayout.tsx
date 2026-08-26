"use client"

import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { 
    LayoutDashboard, 
    MessageSquare, 
    Terminal, 
    CreditCard, 
    Settings, 
    ChevronDown, 
    ChevronUp,
    Bell,
    Send,
    Radio,
    Globe,
    Plus,
    Zap,
    Menu,
    X
} from "lucide-react"

type SidebarSubItem = {
    label: string
    path: string
}

type SidebarItem = {
    label: string
    icon: React.ComponentType<{ size: number; className?: string }>
    path?: string
    subItems?: SidebarSubItem[]
}

type DashboardLayoutProps = {
    children: React.ReactNode
}
import { useBalance } from "../../features/wallet/hooks/useBalance"

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const location = useLocation()
    const navigate = useNavigate()
    const { data, isLoading, error } = useBalance();
    
    // UI Layout States
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({ "Engage": true })
    const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false)
    const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
    
    const currentPath = location.pathname

    const navigationConfig: SidebarItem[] = [
        { label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
        {
            label: "Engage",
            icon: MessageSquare,
            subItems: [
                { label: "Send Messages", path: "/dashboard/sms" },
                { label: "Contacts & Lists", path: "/dashboard/contacts" },
                { label: "Email Configuration", path: "/dashboard/email-config" },
                { label: "Email Templates", path: "/dashboard/email-templates" },
                { label: "KYC Verification", path: "/dashboard/kyc" },
                { label: "OTP Guide Docs", path: "/dashboard/otp-guide" },
            ]
        },
        {
            label: "Signals",
            icon: Radio,
            subItems: [
                { label: "Webhooks Configuration", path: "/dashboard/webhooks" },
                { label: "API Keys & Sandbox", path: "/dashboard/api-keys" },
            ]
        },
        {
            label: "Sotel Systems",
            icon: Globe,
            subItems: [
                { label: "Sender ID Registry", path: "/dashboard/sender-id" },
                { label: "Carrier Routing Trunks", path: "/dashboard/trunks" },
            ]
        }
    ]

    const handleNavigation = (path: string) => {
        navigate(path)
        setIsMobileSidebarOpen(false) // Close drawer automatically on mobile navigation
    }

    // Isolated Sidebar Content Factory for cleaner re-use across viewpoints
    const SidebarContent = () => (
        <div className="flex flex-col h-full justify-between bg-white select-none">
            <div>
                {/* Header Logo Frame */}
                <div className="h-16 flex items-center px-6 border-b border-[#e2e8f0]">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#004aad] flex items-center justify-center text-white font-black text-sm tracking-tighter">
                            P
                        </div>
                        <span className="font-extrabold text-sm tracking-wider text-[#0f172a] uppercase">
                            Pingstack
                        </span>
                    </div>
                </div>

                {/* Clean Workspace Selector Dropdown */}
                <div className="px-4 py-3 border-b border-[#f1f5f9] relative">
                    <button 
                        onClick={() => setIsOrgDropdownOpen(!isOrgDropdownOpen)}
                        className="w-full flex items-center justify-between p-2 rounded-xl bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#cbd5e1] transition-all cursor-pointer text-left"
                    >
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#004aad]/10 flex items-center justify-center text-xs font-bold text-[#004aad]">
                                AW
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-[#334155] leading-tight">Abdulwahab</span>
                                <span className="text-[10px] text-[#94a3b8] font-medium">Default Node</span>
                            </div>
                        </div>
                        <ChevronDown size={14} className={`text-[#64748b] transition-transform ${isOrgDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isOrgDropdownOpen && (
                        <div className="absolute left-4 right-4 mt-1 bg-white border border-[#e2e8f0] rounded-xl shadow-lg p-1 z-30 flex flex-col">
                            <button className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold bg-[#004aad]/5 text-[#004aad]">
                                Production Live Node
                            </button>
                            <button className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#64748b] hover:bg-[#f8fafc] transition-colors">
                                Developer Sandbox
                            </button>
                        </div>
                    )}
                </div>

                {/* Clean Menu Iteration Factory */}
                <nav className="p-3 flex flex-col gap-0.5">
                    {navigationConfig.map((item) => {
                        const Icon = item.icon
                        const hasSubItems = !!item.subItems
                        const isExpanded = !!expandedMenus[item.label]
                        const isDirectActive = item.path ? currentPath === item.path : false

                        return (
                            <div key={item.label} className="w-full flex flex-col">
                                <button
                                    onClick={() => hasSubItems ? setExpandedMenus(prev => ({ ...prev, [item.label]: !prev[item.label] })) : item.path && handleNavigation(item.path)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                                        isDirectActive 
                                            ? "bg-[#004aad] text-white" 
                                            : "text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={16} className={isDirectActive ? "text-white" : "text-[#94a3b8]"} />
                                        <span>{item.label}</span>
                                    </div>
                                    {hasSubItems && (
                                        isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />
                                    )}
                                </button>

                                {hasSubItems && isExpanded && (
                                    <div className="flex flex-col gap-0.5 pl-4 mt-0.5 ml-4 border-l border-[#e2e8f0]">
                                        {item.subItems?.map((subItem) => {
                                            const isChildActive = currentPath === subItem.path
                                            return (
                                                <button
                                                    key={subItem.path}
                                                    onClick={() => handleNavigation(subItem.path)}
                                                    className={`w-full text-left px-3 py-1.5 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                                                        isChildActive
                                                            ? "text-[#004aad] font-bold bg-[#004aad]/5"
                                                            : "text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc]"
                                                    }`}
                                                >
                                                    {subItem.label}
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </nav>
            </div>

            {/* Bottom Core Base Utilities */}
            <div className="p-3 border-t border-[#f1f5f9] flex flex-col gap-0.5">
                <button onClick={() => handleNavigation("/dashboard/billing")} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#64748b] hover:bg-[#f1f5f9] cursor-pointer">
                    <CreditCard size={16} />
                    <span>Billing & Credits</span>
                </button>
                <button onClick={() => handleNavigation("/dashboard/settings")} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#64748b] hover:bg-[#f1f5f9] cursor-pointer">
                    <Settings size={16} />
                    <span>Settings</span>
                </button>
            </div>
        </div>
    )

    return (
        <div className="w-full min-h-screen bg-[#f8fafc] text-[#1e293b] flex antialiased relative">
            
            {/* DESKTOP SIDEBAR VIEWPORT (Hidden on Mobile) */}
            <aside className="hidden md:flex w-64 bg-white border-r border-[#e2e8f0] flex-col justify-between z-20 flex-shrink-0">
                <SidebarContent />
            </aside>

            {/* MOBILE SIDEBAR SLIDE DRAWER (Hidden on Desktop) */}
            {isMobileSidebarOpen && (
                <div className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity">
                    <div className="w-64 h-full bg-white relative animate-slide-in">
                        <button 
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className="absolute right-4 top-4 text-[#64748b] hover:text-[#0f172a] p-1 rounded-lg"
                        >
                            <X size={18} />
                        </button>
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* MAIN APP REGION WRAPPER */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* STABLE RESPONSIVE NAVBAR */}
                <header className="h-16 bg-white border-b border-[#e2e8f0] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-10 select-none">
                    
                    {/* Left side actions: Drawer toggler & Financial Display */}
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="md:hidden text-[#475569] hover:bg-[#f1f5f9] p-1.5 rounded-xl transition-all cursor-pointer"
                        >
                            <Menu size={20} />
                        </button>

                        <div className="flex items-center gap-2 bg-[#f8fafc] border border-[#e2e8f0] px-2.5 py-1.5 rounded-xl">
                            <span className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-wider hidden sm:inline">Balance:</span>
                            <span className="text-xs font-black text-[#1e293b] font-mono">₦{data}</span>
                            <button 
                                onClick={() => navigate("/dashboard/billing")}
                                className="ml-0.5 bg-[#004aad] text-white px-1.5 py-0.5 rounded-md text-[10px] font-bold hover:bg-[#003680] transition-colors flex items-center gap-0.5 cursor-pointer"
                            >
                                <Plus size={9} /> <span className="hidden sm:inline">Fund</span>
                            </button>
                        </div>
                    </div>

                    {/* Right side actions: Launch control utilities */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        
                        {/* Dropdown Utilities Element */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsQuickMenuOpen(!isQuickMenuOpen)}
                                className="bg-white border border-[#e2e8f0] hover:border-[#cbd5e1] text-[#334155] px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                            >
                                <Zap size={14} className="text-[#004aad]" />
                                <span className="hidden sm:inline">Quick Actions</span>
                                <ChevronDown size={12} />
                            </button>

                            {isQuickMenuOpen && (
                                <div className="absolute right-0 mt-1.5 w-44 bg-white border border-[#e2e8f0] rounded-xl shadow-xl p-1 z-30 flex flex-col">
                                    <button onClick={() => { setIsQuickMenuOpen(false); navigate("/dashboard/sms"); }} className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[#334155] hover:bg-[#f8fafc] flex items-center gap-2">
                                        <Send size={12} className="text-[#004aad]" /> Instant SMS
                                    </button>
                                    <button onClick={() => setIsQuickMenuOpen(false)} className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-[#334155] hover:bg-[#f8fafc] flex items-center gap-2">
                                        <Terminal size={12} className="text-[#004aad]" /> Test OTP
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Send Message Button */}
                        <button 
                            onClick={() => navigate("/dashboard/sms")}
                            className="bg-[#004aad] text-white px-2.5 sm:px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-[#003680] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-[#004aad]/10"
                        >
                            <Send size={13} />
                            <span className="hidden sm:inline">Send Message</span>
                        </button>
                        
                        <div className="w-px h-5 bg-[#e2e8f0] hidden sm:block" />
                        
                        <button className="text-[#94a3b8] hover:text-[#475569] relative p-1.5 rounded-full hover:bg-[#f1f5f9] cursor-pointer hidden sm:block">
                            <Bell size={18} />
                            <span className="w-1.5 h-1.5 bg-[#004aad] rounded-full absolute top-1.5 right-1.5" />
                        </button>
                    </div>
                </header>

                {/* CORE CANVAS VIEWPORT PORT PORTAL */}
                <main className="flex-1 p-4 sm:p-8 max-w-[1600px] w-full mx-auto overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}