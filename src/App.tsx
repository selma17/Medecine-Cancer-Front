import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import MainApp from "./AddPatient";
import LoginForm from "./Login";
import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";
import PatientManagement from "./PatientManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import FormOne from "./FormOne";
import FormTwo from "./FormTwo";
import StepFour from "./FormFour";
import FormThree from "./FormThree";

function App() {
  return (
    <Router>
      <Toaster richColors position="top-center" />
      <Routes>
        {/* Landing page publique */}
        <Route path="/" element={<LandingPage />} />

        {/* Page de connexion */}
        <Route path="/login" element={<LoginForm />} />

        {/* Dashboard après connexion */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Gestion des patients */}
        <Route path="/patient-management" element={
          <ProtectedRoute>
            <PatientManagement />
          </ProtectedRoute>
        } />

        <Route path="/formone" element={<FormOne />} />
        <Route path="/formtwo" element={<FormTwo />} />
        <Route path="/formthree" element={<FormThree />} />
        <Route path="/formfour" element={<StepFour />} />
        <Route path="/add-patient" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

export default App;