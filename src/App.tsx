import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Dashboard from '@/pages/Dashboard';
import FunnelAnalysis from '@/pages/FunnelAnalysis';
import PaymentGateways from '@/pages/PaymentGateways';
import UserSatisfaction from '@/pages/UserSatisfaction';
import Settings from '@/pages/Settings';
import Layout from '@/components/Layout';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="funnel-analytics-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="funnel" element={<FunnelAnalysis />} />
            <Route path="gateways" element={<PaymentGateways />} />
            <Route path="satisfaction" element={<UserSatisfaction />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
