import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import PackagesPage from "@/pages/packages";
import PackageDetailPage from "@/pages/package-detail";
import ActivitiesPage from "@/pages/activities";
import BuilderPage from "@/pages/builder";
import ContactPage from "@/pages/contact";
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminInquiries from "@/pages/admin/inquiries";
import AdminPackages from "@/pages/admin/packages";
import AdminActivities from "@/pages/admin/activities";
import AdminAccommodations from "@/pages/admin/accommodations";

const queryClient = new QueryClient();

function PublicRouter() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/packages" component={PackagesPage} />
          <Route path="/packages/:id" component={PackageDetailPage} />
          <Route path="/activities" component={ActivitiesPage} />
          <Route path="/builder" component={BuilderPage} />
          <Route path="/contact" component={ContactPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function AdminRouter() {
  return (
    <Switch>
      <Route path="/admin" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/admin/inquiries" component={AdminInquiries} />
      <Route path="/admin/packages" component={AdminPackages} />
      <Route path="/admin/activities" component={AdminActivities} />
      <Route path="/admin/accommodations" component={AdminAccommodations} />
    </Switch>
  );
}

function RootRouter() {
  return (
    <Switch>
      <Route path="/admin" component={AdminRouter} />
      <Route path="/admin/:rest*" component={AdminRouter} />
      <Route component={PublicRouter} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <RootRouter />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
