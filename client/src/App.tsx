import { Switch, Route } from "wouter";
import SimpleDashboard from "@/pages/simple-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SimpleDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Router />
    </div>
  );
}

export default App;