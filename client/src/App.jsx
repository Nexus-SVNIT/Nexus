import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import {
  About,
  Achievements,
  AchievementsForm,
  AlumniMenu,
  Connect,
  Events,
  Forms,
  Home,
  Layout,
  NotFound,
  RegisterForm,
  Teams,
} from "./components";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<Teams />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route
              path="/achievements/add-new"
              element={<AchievementsForm />}
            />
            <Route path="/events" element={<Events />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/about" element={<About />} />
            <Route path="/register/:formId" element={<RegisterForm />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/connect/alumni" element={<AlumniMenu />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
