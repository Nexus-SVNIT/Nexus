import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import {
  Navigate,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import routes from "./routes";
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
import ECommerce from "./pages/Dashboard/AdminPanel";
import Loader from "./components/Loader/Loader";
import AdminPanel from "./pages/Dashboard/AdminPanel";
import AdminLayout from "./layout/AdminLayout";
import Login from "./components/Login/Login";
const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminPanel />} />
          </Route>

          <Route path="/" element={<DefaultLayout />}>
            <Route index element={<Home />} />
            <Route path="team" element={<Teams />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="achievements/add-new" element={<AchievementsForm />} />
            <Route path="events" element={<Events />} />
            <Route path="forms" element={<Forms />} />
            <Route path="about" element={<About />} />
            <Route path="register/:formId" element={<RegisterForm />} />
            <Route path="connect" element={<Connect />} />
            <Route path="connect/alumni" element={<AlumniMenu />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
