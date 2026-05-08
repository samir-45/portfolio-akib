import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme";
import { useQuery } from "@tanstack/react-query";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Work from "@/pages/Work";
import About from "@/pages/About";
import Process from "@/pages/Process";
import Playground from "@/pages/Playground";
import Contact from "@/pages/Contact";
import CaseStudy from "@/pages/CaseStudy";

import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProjects from "@/pages/admin/Projects";
import AdminPlayground from "@/pages/admin/Playground";
import AdminProcess from "@/pages/admin/Process";
import AdminTestimonials from "@/pages/admin/Testimonials";
import AdminMessages from "@/pages/admin/Messages";
import AdminSettings from "@/pages/admin/Settings";

function AdminGuard({ component: Component }: { component: React.ComponentType }) {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return <Redirect to="/admin/login" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/work" component={Work} />
      <Route path="/work/:slug" component={CaseStudy} />
      <Route path="/about" component={About} />
      <Route path="/process" component={Process} />
      <Route path="/playground" component={Playground} />
      <Route path="/contact" component={Contact} />

      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={() => <AdminGuard component={AdminDashboard} />} />
      <Route path="/admin/projects" component={() => <AdminGuard component={AdminProjects} />} />
      <Route path="/admin/playground" component={() => <AdminGuard component={AdminPlayground} />} />
      <Route path="/admin/process" component={() => <AdminGuard component={AdminProcess} />} />
      <Route path="/admin/testimonials" component={() => <AdminGuard component={AdminTestimonials} />} />
      <Route path="/admin/messages" component={() => <AdminGuard component={AdminMessages} />} />
      <Route path="/admin/settings" component={() => <AdminGuard component={AdminSettings} />} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
