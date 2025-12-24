import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import Reports from "./pages/Reports";
import RulesSettings from "./pages/RulesSettings";
import ArchivingStats from "./pages/ArchivingStats";
import CustomerConsentDetails from "./pages/CustomerConsentDetails";
import GroupConsentDetails from "./pages/GroupConsentDetails";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/groups" element={<Groups />} />
            <Route path="/groups/:id" element={<GroupDetail />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/archiving" element={<ArchivingStats />} />
            <Route path="/archiving/customer-details" element={<CustomerConsentDetails />} />
            <Route path="/archiving/group-details" element={<GroupConsentDetails />} />
            <Route path="/settings/rules" element={<RulesSettings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
