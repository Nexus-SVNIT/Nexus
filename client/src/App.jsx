import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import {
  About,
  Connect,
  CreateForm,
  Events,
  Forms,
  Home,
  Layout,
  NotFound,
  RegisterForm,
  Teams,
} from "./components";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/team" element={<Teams />} />
            <Route path="/events" element={<Events />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/about" element={<About />} />
            <Route path="/register/:formId" element={<RegisterForm />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
