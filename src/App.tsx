import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import DashboardLayout from "./components/layout/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Wallet from "./pages/dashboard/Wallet";
const App = () => {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected SME Dashboard Routes */}
      <Route 
        path="/dashboard/*" 
        element={
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<Dashboard/>} />
              <Route path="/sms" element={<div>SMS Campaigns Screen (Coming Soon)</div>} />
              <Route path="/api-keys" element={<div>API Keys & Sandbox Screen (Coming Soon)</div>} />
              <Route path="/webhooks" element={<div>Webhooks & Logs Screen (Coming Soon)</div>} />
              <Route path="/sender-id" element={<div>Sender ID Registry Screen (Coming Soon)</div>} />
              <Route path="/billing" element={<Wallet/>} />
              <Route path="/settings" element={<div>Workspace Settings Screen (Coming Soon)</div>} />
            </Routes>
          </DashboardLayout>
        } 
      />
    </Routes>
  );
};

export default App;