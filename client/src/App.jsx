import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy } from "react";
import { Toaster } from "react-hot-toast";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login/Login";
import AdminLayout from "./layout/AdminLayout";
import { AdminRoutes, DefaultRoutes } from "./routes";
import LoginForm from "./components/LogInForm/LogInForm";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import VerifyEmail from "./components/VerifyEmail/VerifyEmail";
import Profile from "./components/Profile/Profile";
import CoreLoginPage from "./components/Login/CoreLoginPage";
import ShowProject from "./components/Project/showProject";
import PasswordResetEmail from "./components/PasswordResetEmail/PasswordResetEmail";
const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));

const queryClient = new QueryClient();
const token = localStorage.getItem('token');

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {
            token ?
              <>
                <Route path="/login" element={<Navigate to={'/'}></Navigate>} />
                <Route path="/signup" element={<Navigate to={'/'}></Navigate>} />
                <Route path="/auth/verify/:token" element={<Navigate to={'/'}></Navigate>} />
                <Route path="/auth/reset-password/:token" element={<PasswordResetEmail />} />
              </> :
              <>
                <Route path="/login" element={<LoginForm />} />
                <Route path="/projects" element={<ShowProject/>}/>
              <Route path="/profile" element={<Navigate to={'/login'}></Navigate>} />
                <Route path="/signup" element={<SignUpForm />} />
                <Route path="/auth/verify/:token" element={<VerifyEmail />} />
                <Route path="/auth/reset-password/:token" element={<PasswordResetEmail />} />
              </>

          }

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
  );
}

export default App;
