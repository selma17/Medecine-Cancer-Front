import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import MainApp from "./AddPatient";
import LoginForm from "./Login";
import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";
import PatientManagement from "./PatientManagement";
import NotFound from "./NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import FormOne from "./FormOne";
import FormTwo from "./FormTwo";
import StepFour from "./FormFour";
import FormThree from "./FormThree";
import Finalisation from "./Finalisation";

function App() {
  return (
    <Router>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/patient-management" element={
          <ProtectedRoute><PatientManagement /></ProtectedRoute>
        } />
        <Route path="/formone" element={<FormOne />} />
        <Route path="/formtwo" element={<FormTwo />} />
        <Route path="/formthree" element={<FormThree />} />
        <Route path="/formfour" element={<StepFour />} />
        <Route path="/add-patient" element={<MainApp />} />
        <Route path="/finalisation" element={
          <ProtectedRoute><Finalisation /></ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;