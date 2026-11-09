import { InlineSkeleton } from "../../ui/Skeleton";
import { useInterfaceSettings } from "../../features/settings/store/useInterfaceSettings";
import Brand from "../brand/Brand";
import { useEffect, useId, useState, type ReactNode, type ComponentType } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Modal, useMediaQuery } from "@mui/material";
import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "framer-motion";
import { LayoutDashboard, MessageSquare, Send, Radio, Globe, CreditCard, Settings, ChevronDown, ArrowUpRight, Menu, X, Plus, Wallet, ChevronLeft, type IconProps } from "../../ui/icons";
import { useBalance } from "../../features/wallet/hooks/useBalance";
import { formatNaira } from "../../utils/currency";
import "./dashboard.css";

type NavItem = { label: string; path: string };
type NavGroup = { label: string; icon: ComponentType<IconProps>; items: NavItem[] };
const groups: NavGroup[] = [
  { label: "Messaging", icon: MessageSquare, items: [
    { label: "Send messages", path: "/dashboard/sms" },
    { label: "Contacts & lists", path: "/dashboard/contacts" },
    { label: "Email configuration", path: "/dashboard/email-config" },
  ] },
  { label: "Marketing", icon: Send, items: [
    { label: "Campaigns", path: "/dashboard/campaigns" },
    { label: "Email templates", path: "/dashboard/email-templates" },
  ] },
  { label: "Developers", icon: Radio, items: [
    { label: "API keys & sandbox", path: "/dashboard/api-keys" },
    { label: "Webhooks", path: "/dashboard/webhooks" },
    { label: "OTP guide", path: "/dashboard/otp-guide" },
  ] },
  { label: "Account setup", icon: Globe, items: [
    { label: "Sender IDs", path: "/dashboard/sender-id" },
    { label: "KYC verification", path: "/dashboard/kyc" },
  ] },
];

function Sidebar({ close, collapsed = false, expand }: { close?: () => void; collapsed?: boolean; expand?: () => void }) {
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const sidebarId = useId();
  return (
    <div className="dashboard-sidebar-content">
      <div className="dashboard-brand-row">
        <Link to="/dashboard" onClick={close} className="dashboard-brand" aria-label="Pingstack overview">
          <Brand size={44} />
        </Link>
        {close && <button type="button" autoFocus className="dashboard-icon-button" onClick={close} aria-label="Close navigation"><X /></button>}
      </div>
      <div className="dashboard-workspace">
        <span className="dashboard-workspace-avatar"><MessageSquare size={22} /></span>
        <div><strong>Your workspace</strong><span>Messaging workspace</span></div>
      </div>
      <nav className="dashboard-navigation" aria-label="Main navigation">
        <p className="dashboard-nav-caption">Workspace</p>
        <NavLink end to="/dashboard" aria-label="Overview" title={collapsed ? "Overview" : undefined} onClick={close} className={({ isActive }) => `dashboard-nav-link ${isActive ? "is-active" : ""}`}><LayoutDashboard /><span>Overview</span></NavLink>
        {groups.map(({ label, icon: Icon, items }, index) => {
          const active = items.some(item => pathname === item.path || pathname.startsWith(item.path + "/"));
          const open = !collapsed && (expanded[label] ?? (active || label === "Messaging"));
          return (
            <div className="dashboard-nav-group" key={label}>
              <button className={`dashboard-nav-link ${active ? "has-active-child" : ""}`} aria-label={label} title={collapsed ? label : undefined} onClick={() => { if (collapsed) expand?.(); setExpanded(prev => ({ ...prev, [label]: !open })); }} aria-expanded={open} aria-controls={`${sidebarId}-nav-group-${index}`}>
                <Icon /><span>{label}</span>
                <motion.span className="dashboard-nav-chevron" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}><ChevronDown size={16} /></motion.span>
              </button>
              <AnimatePresence initial={false}>
                {open && <motion.div id={`${sidebarId}-nav-group-${index}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="dashboard-nav-children">{items.map(item => <NavLink key={item.path} to={item.path} onClick={close} className={({ isActive }) => `dashboard-nav-child ${isActive ? "is-active" : ""}`}>{item.label}</NavLink>)}</div>
                </motion.div>}
              </AnimatePresence>
            </div>
          );
        })}
        <div className="dashboard-account-links">
        <NavLink to="/dashboard/billing" aria-label="Billing and credits" title={collapsed ? "Billing & credits" : undefined} onClick={close} className={({ isActive }) => `dashboard-nav-link ${isActive ? "is-active" : ""}`}><CreditCard /><span>Billing & credits</span></NavLink>
        <NavLink to="/dashboard/settings" aria-label="Settings" title={collapsed ? "Settings" : undefined} onClick={close} className={({ isActive }) => `dashboard-nav-link ${isActive ? "is-active" : ""}`}><Settings /><span>Settings</span></NavLink>
        </div>
      </nav>
      <div className="dashboard-sidebar-footer">
        <Link to="/dashboard/otp-guide" onClick={close} className="dashboard-help-link"><span>Build with Pingstack</span><ArrowUpRight size={17} /></Link>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { sidebarCollapsed, reduceMotion, showBalance, update, toggleSidebar } = useInterfaceSettings();
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const prefersReducedMotion = useReducedMotion();
  const motionDuration = reduceMotion || prefersReducedMotion ? 0 : 0.24;
  const { pathname } = useLocation();
  useEffect(() => {
    setMobileOpen(false);
  }, [isDesktop, pathname]);
  const toggleNavigation = () => {
    if (isDesktop) toggleSidebar();
    else setMobileOpen(previous => !previous);
  };
  const { data, isPending, isError } = useBalance();
  const page = groups.flatMap(group => group.items).find(item => pathname === item.path || pathname.startsWith(item.path + "/"))?.label
    ?? (pathname === "/dashboard/billing" ? "Billing & credits" : pathname === "/dashboard/settings" ? "Settings" : "Overview");
  return (
    <MotionConfig reducedMotion={reduceMotion ? "always" : "user"} transition={{ duration: 0.22, ease: "easeOut" }}>
      <div className={`dashboard-shell ${sidebarCollapsed ? "is-sidebar-collapsed" : ""} ${reduceMotion ? "is-reduced-motion" : ""}`}>
        <a className="dashboard-skip-link" href="#dashboard-content">Skip to content</a>
        <motion.aside
          id="dashboard-desktop-navigation"
          className="dashboard-desktop-sidebar"
          initial={false}
          animate={{ width: sidebarCollapsed ? 76 : 224 }}
          transition={{ duration: motionDuration, ease: [0.22, 1, 0.36, 1] }}
        ><Sidebar collapsed={sidebarCollapsed} expand={() => update({ sidebarCollapsed: false })} /></motion.aside>
        <AnimatePresence>
          {mobileOpen && !isDesktop && (
            <Modal open onClose={() => setMobileOpen(false)} hideBackdrop aria-label="Mobile navigation">
              <motion.div className="dashboard-mobile-overlay" initial="closed" animate="open" exit="closed" tabIndex={-1}>
                <motion.div
                  className="dashboard-mobile-backdrop"
                  aria-hidden="true"
                  onClick={() => setMobileOpen(false)}
                  variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
                  transition={{ duration: motionDuration }}
                />
                <motion.aside
                  id="dashboard-mobile-navigation"
                  role="dialog"
                  aria-modal="true"
                  aria-label="Main navigation"
                  className="dashboard-mobile-panel"
                  variants={{ closed: { x: "-100%" }, open: { x: 0 } }}
                  transition={{ duration: motionDuration, ease: [0.22, 1, 0.36, 1] }}
                ><Sidebar close={() => setMobileOpen(false)} /></motion.aside>
              </motion.div>
            </Modal>
          )}
        </AnimatePresence>
        <div className="dashboard-main">
          <header className="dashboard-topbar">
            <div className="flex items-center gap-3 min-w-0">
              <motion.button
                type="button"
                className="dashboard-icon-button dashboard-navigation-toggle"
                onClick={toggleNavigation}
                aria-label={isDesktop ? sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar" : mobileOpen ? "Close navigation" : "Open navigation"}
                aria-expanded={isDesktop ? !sidebarCollapsed : mobileOpen}
                aria-controls={isDesktop ? "dashboard-desktop-navigation" : mobileOpen ? "dashboard-mobile-navigation" : undefined}
                title={isDesktop ? sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar" : "Open navigation"}
                whileTap={motionDuration ? { scale: 0.94 } : undefined}
              >
                {isDesktop ? <motion.span className="dashboard-toggle-glyph" initial={false} animate={{ rotate: sidebarCollapsed ? 180 : 0 }} transition={{ duration: motionDuration }}><ChevronLeft size={20} /></motion.span> : <Menu size={21} />}
              </motion.button>
              <div className="dashboard-breadcrumb"><span>Workspace</span><span className="text-slate-300">/</span><strong>{page}</strong></div>
            </div>
            <div className="flex items-center gap-3 sm:gap-5">
              {showBalance && <Link to="/dashboard/billing" className="dashboard-header-balance" aria-label="View wallet and billing"><Wallet size={18} /><span>{isPending ? <InlineSkeleton width={90} height={18} label="Loading balance" /> : isError ? "Balance unavailable" : `₦${formatNaira(data)}`}</span></Link>}
              <Link to="/dashboard/sms" className="dashboard-button dashboard-button-primary"><Plus size={18} /><span className="hidden sm:inline">Send message</span><span className="sr-only sm:hidden">Send message</span></Link>
            </div>
          </header>
          <main id="dashboard-content" tabIndex={-1} className="dashboard-content">{children}</main>
        </div>
      </div>
    </MotionConfig>
  );
}
