import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public & Auth Routes
import Landing from './pages/Landing'; // Newly added Landing page import
import Auth from './pages/Auth';
import ClientIntake from './pages/ClientIntake';
import Onboarding from './pages/Onboarding';
// Dashboard Layout & Pages
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import IntakeLinks from './pages/dashboard/IntakeLinks';
import Leads from './pages/dashboard/Leads';
import Blueprints from './pages/dashboard/Blueprints';
import Settings from './pages/dashboard/Settings';
import Activity from './pages/dashboard/Activity';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Landing />} />
        
        {/* Authentication Page */}
        <Route path="/auth" element={<Auth />} />

        {/* 
          PHASE 3: Public Client Intake Portal
          No authentication required. Uses the slug to fetch theme and context.
        */}
        <Route path="/intake/:slug" element={<ClientIntake />} />

        <Route path="/onboarding" element={<Onboarding />} />

        {/* 
          PHASE 1 & 2: Protected Dashboard Routes
          All routes inside this block are wrapped in the DashboardLayout 
          which handles session validation and the sidebar UI.
        */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="links" element={<IntakeLinks />} />
          <Route path="leads" element={<Leads />} />
          <Route path="blueprints" element={<Blueprints />} />
          <Route path="settings" element={<Settings />} />
          <Route path="Activity" element={<Activity />} />
        </Route>

        {/* Catch-all 404 - Redirects to home/landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}