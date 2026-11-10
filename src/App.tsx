import SettingsPage from "./pages/settings/Settings";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Wallet from "./pages/dashboard/Wallet";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import SenderId from "./pages/dashboard/SenderId";
import MessageActivity from "./pages/messages/MessageActivity";
import Automations from "./pages/automations/Automations";
import ContactList from "./pages/contacts/ContactList"
import EmailConfig from "./pages/contacts/Email-Config";
import OtpGuide from "./pages/contacts/Otp-Guide";
import EmailTemplates from "./pages/contacts/Email-Templates";
import KycVerification from "./pages/kyc/KycUpload";
import WebhooksConfig from "./pages/webhook/Webhook";
import ApiKeysPlayground from "./pages/settings/ApiKey";
import SingleTemplate from "./pages/contacts/SingleTemplate";
import EmailTemplateEditor from "./pages/contacts/EmailTemlateEditor";
import Campaigns from "./pages/marketing/Campaigns";
import CreateCampaignPage from "./pages/marketing/CreateCampaignPage";
import CampaignDetailPage from "./pages/marketing/CampaignDetailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
const App = () => {


  
  
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
      <Route path="/reset-password" element={<ResetPassword/>}/>

      {/* Protected SME Dashboard Routes */}
      <Route path="/dashboard/*" element={<ProtectedRoute />}>
        <Route element={<DashboardLayout><Outlet /></DashboardLayout>}>
          <Route index element={<Dashboard />} />
          <Route path="sms" element={<Navigate to="/dashboard/automations" replace />} />
          <Route path="message-activity" element={<MessageActivity />} />
          <Route path="automations" element={<Automations />} />
          <Route path="contacts" element={<ContactList />} />
          <Route path="kyc" element={<KycVerification/>}/>
          <Route path="api-keys" element={<ApiKeysPlayground/>} />
          <Route path="webhooks" element={<WebhooksConfig/>} />
          <Route path="email-config" element={<EmailConfig />} />
          <Route path="otp-guide" element={<OtpGuide />} />
          <Route path="email-templates" element={<EmailTemplates />} />
          <Route path="sender-id" element={<SenderId />} />
          <Route path="billing" element={<Wallet />} />
          <Route path="email-templates/:templateId/edit" element={<EmailTemplateEditor />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="email-templates/:templateId" element={<SingleTemplate/>} />
          <Route path="campaigns" element={<Campaigns/>}/>
          <Route path="campaigns/create" element={<CreateCampaignPage />} />
          <Route path="campaigns/:campaignId" element={<CampaignDetailPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
