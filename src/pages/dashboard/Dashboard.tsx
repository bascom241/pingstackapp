import WelcomeMessageSection from "../../components/dashboard/main/WelcomeMessageSection";
import DeveloperSettings from "../../components/dashboard/main/DeveloperSetting";
import AnalyticsChart from "../../components/dashboard/main/ApiUsageAnalysis";

const Dashboard = () => {
  return (
    <main className="flex flex-col lg:flex-row justify-center items-start gap-6 min-h-screen w-full px-4 md:px-6 py-8 bg-gray-50/50">
      
      {/* Left Column: Welcome & Analytics */}
      <section className="flex-1 w-full max-w-xl mx-auto lg:mx-0 flex flex-col gap-6">
        <WelcomeMessageSection />
        <AnalyticsChart title="API Usage History"/>
      </section>

      {/* Right Column: Developer Credentials & History */}
      <section className="flex-1 w-full max-w-xl mx-auto lg:mx-0">
        <DeveloperSettings />
        <div>{/* Content */}</div>
      </section>

    </main>
  );
};

export default Dashboard;