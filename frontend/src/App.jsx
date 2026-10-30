import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Settings from './pages/dashboard/Settings';
import Activity from './pages/dashboard/Activity';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import IntakeLinks from './pages/dashboard/IntakeLinks';
import Leads from './pages/dashboard/Leads';
import Blueprints from './pages/dashboard/Blueprints';
import ClientIntake from './pages/ClientIntake';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
        <Routes>
          {/* Public Routes with standard Header */}
          <Route path="/" element={<><Header /><Landing /></>} />
          <Route path="/auth" element={<><Header /><Auth /></>} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/talk/:slug" element={<ClientIntake />} />
          
          {/* Protected SaaS Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="links" element={<IntakeLinks />} />
            <Route path="leads" element={<Leads />} />
            <Route path="blueprints" element={<Blueprints />} />
            <Route path="activity" element={<Activity />} />
            <Route path="settings" element={<Settings />} />
            
          </Route>
        </Routes>
      </div>
    </Router>
  );
}