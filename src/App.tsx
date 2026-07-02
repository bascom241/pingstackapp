import { Routes, Route, Outlet } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Wallet from "./pages/dashboard/Wallet";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import SenderId from "./pages/dashboard/SenderId";
import Sms from "./pages/messages/Sms";
import ContactList from "./pages/contacts/ContactList"
import EmailConfig from "./pages/contacts/Email-Config";
import OtpGuide from "./pages/contacts/Otp-Guide";
import EmailTemplates from "./pages/contacts/Email-Templates";
import KycVerification from "./pages/kyc/KycUpload";
import WebhooksConfig from "./pages/webhook/Webhook";
import ApiKeysPlayground from "./pages/settings/ApiKey";
const App = () => {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected SME Dashboard Routes */}
      <Route path="/dashboard/*" element={<ProtectedRoute />}>
        <Route element={<DashboardLayout><Outlet /></DashboardLayout>}>
          <Route index element={<Dashboard />} />
          <Route path="sms" element={<Sms />} />
          <Route path="contacts" element={<ContactList />} />
          <Route path="kyc" element={<KycVerification/>}/>
          <Route path="api-keys" element={<ApiKeysPlayground/>} />
          <Route path="webhooks" element={<WebhooksConfig/>} />
          <Route path="email-config" element={<EmailConfig />} />
          <Route path="otp-guide" element={<OtpGuide />} />
          <Route path="email-templates" element={<EmailTemplates />} />
          <Route path="sender-id" element={<SenderId />} />
          <Route path="billing" element={<Wallet />} />
          <Route path="settings" element={<div>Settings Screen</div>} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;