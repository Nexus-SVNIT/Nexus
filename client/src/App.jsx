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

import {  DefaultRoutes } from "./routes";
import LoginForm from "./components/LogInForm/LogInForm";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import VerifyEmail from "./components/VerifyEmail/VerifyEmail";


import PasswordResetEmail from "./components/PasswordResetEmail/PasswordResetEmail";



import AlumniSignUpForm from "./components/AlumniSignUpForm/AlumniSignUpForm";
import FloatingReportButton from './components/UI/FloatingReportButton';
import VerifyAlumniEmail from "./components/VerifyEmail/VerifyAlumniEmail";
const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));

const queryClient = new QueryClient();
const token = localStorage.getItem("token");

function App() {
 
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
                
                {/*<Route
                  path="/profile"
                  element={<Navigate to={"/login"}></Navigate>}
                />*/}
                <Route path="/signup" element={<SignUpForm />} />
                <Route path="/alumni/signup" element={<AlumniSignUpForm />} />
                <Route path="/auth/verify/:token" element={<VerifyEmail />} />
                <Route path="/auth/verify/alumni/:token" element={<VerifyAlumniEmail />} />
                <Route
                  path="/auth/reset-password/:token"
                  element={<PasswordResetEmail />}
                />
              </>
            )}

           

            <Route path="/" element={<DefaultLayout />}>
              {DefaultRoutes.map(({ title, path, component: Component }) => (
                <Route key={title} path={path} element={<Component />} />
              ))}
            </Route>
            
          </Routes>
          <Toaster />
        </Router>
      </QueryClientProvider>
      <FloatingReportButton />
      
    </>
  );
}

export default App;