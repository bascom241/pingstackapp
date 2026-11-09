import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import WelcomeMessageSection from "../../components/dashboard/main/WelcomeMessageSection";
import DeveloperSettings from "../../components/dashboard/main/DeveloperSetting";
import AnalyticsChart from "../../components/dashboard/main/ApiUsageAnalysis";
import TransactionHistory from "../../components/dashboard/main/TransactionHistory";
import { Send, Users, Mail, ArrowUpRight, ShieldCheck, ArrowRight } from "../../ui/icons";

const actions = [
  { title: "Send a message", description: "Reach your customers with SMS", path: "/dashboard/sms", icon: Send },
  { title: "Manage contacts", description: "Keep your audience organized", path: "/dashboard/contacts", icon: Users },
  { title: "Create a campaign", description: "Make your next email count", path: "/dashboard/campaigns/create", icon: Mail },
];

export default function Dashboard() {
  const reducedMotion = useReducedMotion();
  const item = { hidden: { opacity: 0, y: reducedMotion ? 0 : 12 }, visible: { opacity: 1, y: 0 } };
  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.06 } } }}>
      <motion.div variants={item} className="overview-heading">
        <h1>Workspace overview</h1>
        <p>Welcome back. Here is what is happening with your Pingstack workspace.</p>
      </motion.div>
      <div className="overview-grid">
        <div className="overview-stack">
          <motion.section variants={item} aria-label="Wallet summary"><WelcomeMessageSection /></motion.section>
          <motion.section variants={item} aria-label="Transaction analytics"><AnalyticsChart /></motion.section>
          <motion.section variants={item} aria-label="Recent transactions"><TransactionHistory /></motion.section>
        </div>
        <div className="overview-stack">
          <motion.section variants={item} className="dashboard-card" aria-labelledby="quick-actions-title">
            <h2 id="quick-actions-title" className="dashboard-card-title">Quick actions</h2>
            <p className="dashboard-card-description">A shortcut to your next task.</p>
            <div className="mt-2">{actions.map(({ title, description, path, icon: Icon }) => (
              <Link key={path} to={path} className="overview-action"><span><Icon size={20} /></span><span><strong>{title}</strong><small>{description}</small></span><ArrowUpRight size={18} /></Link>
            ))}</div>
          </motion.section>
          <motion.section variants={item} aria-label="Developer access"><DeveloperSettings /></motion.section>
          <motion.section variants={item} className="dashboard-card" aria-labelledby="setup-title">
            <span className="inline-flex rounded-xl bg-blue-50 p-2.5 text-[#004aad] mb-4"><ShieldCheck size={22} /></span>
            <h2 id="setup-title" className="dashboard-card-title">Get ready to send</h2>
            <p className="dashboard-card-description">Review your verification and register a sender ID to set up your messaging workspace.</p>
            <Link to="/dashboard/kyc" className="dashboard-text-link mt-5">Review account setup <ArrowRight size={16} /></Link>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
}
