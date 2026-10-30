import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public & Auth Routes
import Auth from './pages/Auth';
import ClientIntake from './pages/ClientIntake';

// Dashboard Layout & Pages
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import IntakeLinks from './pages/dashboard/IntakeLinks';
import Leads from './pages/dashboard/Leads';
import Blueprints from './pages/dashboard/Blueprints';
import Settings from './pages/dashboard/Settings';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to auth/login */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
        
        {/* Authentication Page */}
        <Route path="/auth" element={<Auth />} />

        {/* 
          PHASE 3: Public Client Intake Portal
          No authentication required. Uses the slug to fetch theme and context.
        */}
        <Route path="/intake/:slug" element={<ClientIntake />} />

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
          
          {/* Optional: Add an activity route if you have a dedicated page for it */}
          {/* <Route path="activity" element={<Activity />} /> */}
        </Route>

        {/* Catch-all 404 - Redirects to dashboard if logged in, or auth if not handled by layout */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}