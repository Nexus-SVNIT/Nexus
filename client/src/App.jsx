import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy } from "react";
import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login/Login";
import AdminLayout from "./layout/AdminLayout";
import { AdminRoutes, DefaultRoutes } from "./routes";
const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={<AdminLayout />}>
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
