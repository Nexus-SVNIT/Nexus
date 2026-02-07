import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy } from "react";
import { Toaster } from "react-hot-toast";
import {
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import "./App.css";

import { DefaultRoutes } from "./routes";

import LoginForm from "./components/LogInForm/LogInForm";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import VerifyEmail from "./components/VerifyEmail/VerifyEmail";
import PasswordResetEmail from "./components/PasswordResetEmail/PasswordResetEmail";
import AlumniSignUpForm from "./components/AlumniSignUpForm/AlumniSignUpForm";
import VerifyAlumniEmail from "./components/VerifyEmail/VerifyAlumniEmail";
import FloatingReportButton from "./components/UI/FloatingReportButton";

const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>

          {/* ---------------- PUBLIC ROUTES ---------------- */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/alumni/signup" element={<AlumniSignUpForm />} />
          <Route path="/auth/verify/:token" element={<VerifyEmail />} />
          <Route path="/auth/verify/alumni/:token" element={<VerifyAlumniEmail />} />
          <Route path="/auth/reset-password/:token" element={<PasswordResetEmail />} />

          {/* ---------------- PROTECTED ROUTES ---------------- */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DefaultLayout />
              </ProtectedRoute>
            }
          >
            {DefaultRoutes.map(({ title, path, component: Component }) => (
              <Route key={title} path={path} element={<Component />} />
            ))}
          </Route>

        </Routes>

        <Toaster />
      </Router>

      <FloatingReportButton />
    </QueryClientProvider>
  );
}

export default App;
