import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy } from "react";
import { Toaster } from "react-hot-toast";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import AdminLayout from "./layout/AdminLayout";
import { AdminRoutes, DefaultRoutes } from "./routes";
import LoginForm from "./components/LogInForm/LogInForm";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import VerifyEmail from "./components/VerifyEmail/VerifyEmail";
import CoreLoginPage from "./components/Login/CoreLoginPage";
import PasswordResetEmail from "./components/PasswordResetEmail/PasswordResetEmail";
import ShowProject from "./components/Project/showProject";
import IssueModal from "./components/Issue/issue";
import { useState } from "react";
const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));

const queryClient = new QueryClient();
const token = localStorage.getItem("token");

function App() {
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const openIssueModal = () => setIsIssueModalOpen(true);
  const closeIssueModal = () => setIsIssueModalOpen(false);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {token ? (
              <>
                <Route path="/login" element={<Navigate to={"/"}></Navigate>} />
                <Route
                  path="/signup"
                  element={<Navigate to={"/"}></Navigate>}
                />
                <Route
                  path="/auth/verify/:token"
                  element={<Navigate to={"/"}></Navigate>}
                />
                <Route
                  path="/auth/reset-password/:token"
                  element={<PasswordResetEmail />}
                />
              </>
            ) : (
              <>
                <Route path="/login" element={<LoginForm />} />
                
                <Route
                  path="/profile"
                  element={<Navigate to={"/login"}></Navigate>}
                />
                <Route path="/signup" element={<SignUpForm />} />
                <Route path="/auth/verify/:token" element={<VerifyEmail />} />
                <Route
                  path="/auth/reset-password/:token"
                  element={<PasswordResetEmail />}
                />
              </>
            )}

            <Route path="/core/admin/login" element={<CoreLoginPage />} />
            <Route path="/core/admin" element={<AdminLayout />}>
              {AdminRoutes.map(({ title, path, component: Component }) => (
                <Route key={title} path={path} element={<Component />} />
              ))}
            </Route>

            <Route path="/" element={<DefaultLayout />}>
              {DefaultRoutes.map(({ title, path, component: Component }) => (
                <Route key={title} path={path} element={<Component />} />
              ))}
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </QueryClientProvider>
      {/* <button
        onClick={openIssueModal}
        className="fixed bottom-4 left-4 z-50 w-40 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-lg"
      >
        Report an Issue
      </button>

      <IssueModal isOpen={isIssueModalOpen} onClose={closeIssueModal} /> */}
    </>
  );
}

export default App;
